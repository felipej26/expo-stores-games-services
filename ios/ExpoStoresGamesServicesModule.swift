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
        
        Function("showLeaderboard") { (leaderboardID: String) in
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
                }
            }
        }
        
        Function("submitScore") { (score: Int, leaderboardID: String) in
            let scoreReporter = GKScore(leaderboardIdentifier: leaderboardID)
            scoreReporter.value = Int64(score)
            scoreReporter.context = 0
            
            GKScore.report([scoreReporter]) { error in
                if let error = error {
                    print("Error submitting score: \(error.localizedDescription)")
                } else {
                    print("Score submitted successfully")
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
