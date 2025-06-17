import ExpoModulesCore
import GameKit

public class ExpoStoresGamesServicesModule:  Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoStoresGamesServices")
        
        AsyncFunction("signIn") { () async throws -> [String: String] in
            let localPlayer = GKLocalPlayer.local
            
            return try await withCheckedThrowingContinuation { continuation in
                var hasResumed = false
                
                localPlayer.authenticateHandler = { viewController, error in
                    guard !hasResumed else {
                        continuation.resume(throwing: NSError(domain: "GameCenter", code: 400, userInfo: [
                            NSLocalizedDescriptionKey: "User already authenticated?"
                        ]))
                        return
                    }

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
                        hasResumed = true
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
            let leaderboards = try await GKLeaderboard.loadLeaderboards(IDs: [leaderboardID])
            
            guard let leaderboard = leaderboards.first else {
                throw NSError(domain: "GameCenter", code: 404, userInfo: [
                    NSLocalizedDescriptionKey: "Leaderboard not found"
                ])
            }
            
            await MainActor.run {
                let viewController = GKGameCenterViewController()
                viewController.gameCenterDelegate = GameCenterDelegate.shared
                
                if let rootVC = UIApplication.shared.delegate?.window??.rootViewController {
                    rootVC.present(viewController, animated: true, completion: nil)
                } else {
                    print("No root view controller available")
                }
            }
            
            return ["status": "shown"]
        }
        
        AsyncFunction("submitScore") { (score: Int, leaderboardID: String) async throws -> [String: Any] in
            try await GKLeaderboard.submitScore(
                score,
                context: 0,
                player: GKLocalPlayer.local,
                leaderboardIDs: [leaderboardID]
            )
            return ["status": "success"]
        }
        
        AsyncFunction("getUserScore") { (leaderboardID: String, timeSpan: Int) async throws -> [String: Any] in
            let leaderboards = try await GKLeaderboard.loadLeaderboards(IDs: [leaderboardID])
            
            guard let leaderboard = leaderboards.first else {
                throw NSError(domain: "GameCenter", code: 404, userInfo: [
                    NSLocalizedDescriptionKey: "Leaderboard not found"
                ])
            }
            
            let (entry, _) = try await leaderboard.loadEntries(
                for: [GKLocalPlayer.local],
                timeScope: GKLeaderboard.TimeScope(rawValue: timeSpan) ?? .allTime
            )
            
            if let entry = entry {
                return [
                    "score": entry.score,
                    "rank": entry.rank,
                    "formattedScore": entry.formattedScore,
                    "context": entry.context
                ]
            } else {
                return [:]  // No score
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
