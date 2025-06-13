import ExpoModulesCore
import GameKit

public class ExpoStoresGamesServicesModule:  Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoStoresGamesServices")
        
        AsyncFunction("signIn") { () async throws -> [String: String] in
            let localPlayer = GKLocalPlayer.local
            
            return try await withCheckedThrowingContinuation { continuation in
                localPlayer.authenticateHandler = { viewController, error in
                    if let error = error  {
                        continuation.resume(throwing: error)
                        return
                    }
                    
                    if let vc = viewController {
                        Task { @MainActor in
                            if let rootVC = UIApplication.shared.delegate?.window??.rootViewController {
                                rootVC.present(vc, animated: true, completion: nil)
                            } else {
                                print("No root view controller available")
                            }
                        }
                        return
                    }
                    
                    if localPlayer.isAuthenticated {
                        continuation.resume(returning: [
                            "playerID": localPlayer.gamePlayerID,
                            "alias": localPlayer.alias,
                            "displayName": localPlayer.displayName
                        ])
                    } else {
                        continuation.resume(throwing: NSError(domain: "GameCenter", code: 401, userInfo: [
                            NSLocalizedDescriptionKey: "User not authenticated"
                        ]))
                    }
                }
            }
        }
        
        AsyncFunction("showLeaderboard") { (leaderboardID: String, timeSpan: Int) async throws -> [String: Any] in
            return try await withCheckedThrowingContinuation { continuation in
                GKLeaderboard.loadLeaderboards(IDs: [leaderboardID]) { leaderboards, error in
                    if let error = error {
                        print("Failed to load leaderboard:", error.localizedDescription)
                        return
                    }
                    
                    guard let leaderboard = leaderboards?.first else {
                        print("Leaderboard not found")
                        return
                    }
                    
                    DispatchQueue.main.async {
                        let viewController = GKGameCenterViewController()
                        viewController.gameCenterDelegate = GameCenterDelegate.shared
                        
                        if let rootVC = UIApplication.shared.delegate?.window??.rootViewController {
                            rootVC.present(viewController, animated: true, completion: nil)
                        } else {
                            print("No root view controller available")
                        }
                        
                        return
                    }
                }
            }
        }
        
        AsyncFunction("submitScore") { (score: Int, leaderboardID: String) async throws -> [String: Any] in
            return try await withCheckedThrowingContinuation { continuation in
                Task{
                    try await GKLeaderboard.submitScore(
                        score,
                        context: 0,
                        player: GKLocalPlayer.local,
                        leaderboardIDs: [leaderboardID]
                    )
                }
                return
            }
        }
        
        AsyncFunction("getUserScore") { (leaderboardID: String) async throws -> [String: Any] in
            return try await withCheckedThrowingContinuation { continuation in
                
                GKLeaderboard.loadLeaderboards(IDs: [leaderboardID]) { leaderboards, _ in
                    leaderboards?[0].loadEntries(
                        for: [GKLocalPlayer.local],
                        timeScope: .allTime)
                    { localPlayerEntry, entries, error  in
                        
                        if let error = error {
                            continuation.resume(throwing: error)
                            return
                        }
                        
                        guard let entry = localPlayerEntry else {
                            continuation.resume(returning: [:]) // No score submitted
                            return
                        }
                        
                        continuation.resume(returning: [
                            "score": entry.score,
                            "rank": entry.rank,
                            "formattedScore": entry.formattedScore,
                            "context": entry.context
                        ])
                    }
                }
            }
        }
    }
}

// MARK: - Game Center Delegate

class GameCenterDelegate: NSObject, GKGameCenterControllerDelegate {
    static let shared = GameCenterDelegate()
    
    func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
        gameCenterViewController.dismiss(animated: true, completion: nil)
    }
}
