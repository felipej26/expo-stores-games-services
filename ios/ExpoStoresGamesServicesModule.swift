import ExpoModulesCore
import GameKit

public class ExpoStoresGamesServicesModule:  Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoStoresGamesServices")

        AsyncFunction("isAuthenticated") { () async -> Bool in
            return GKLocalPlayer.local.isAuthenticated
        }
        
        AsyncFunction("signIn") { () async throws -> [String: String] in
            let localPlayer = GKLocalPlayer.local
            
            return try await withCheckedThrowingContinuation { continuation in
                var hasResumed = false
                
                localPlayer.authenticateHandler = { viewController, error in
                    guard !hasResumed else { return }

                    if let error = error  {
                        hasResumed = true
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
                        hasResumed = true
                        continuation.resume(throwing: NSError(domain: "GameCenter", code: 401, userInfo: [
                            NSLocalizedDescriptionKey: "User not authenticated"
                        ]))
                    }
                }
            }
        }
        
        AsyncFunction("showLeaderboard") { (leaderboardID: String, timeSpan: Int) async throws -> [String: Any] in
            await MainActor.run {
                let viewController = GKGameCenterViewController(
                                leaderboardID: leaderboardID,
                                playerScope: .global,
                                timeScope: GKLeaderboard.TimeScope(rawValue: timeSpan) ?? .allTime
                )
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
        
        AsyncFunction("getUserScore") { (leaderboardID: String, timeSpan: Int) async throws -> [String: Any]? in
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
                return nil  // No score
            }
        }
        
        AsyncFunction("showAchievements") { () async throws -> [String: Any] in
            await MainActor.run {
                let viewController = GKGameCenterViewController(state: .achievements)
                viewController.gameCenterDelegate = GameCenterDelegate.shared
                
                if let rootVC = UIApplication.shared.delegate?.window??.rootViewController {
                    rootVC.present(viewController, animated: true, completion: nil)
                } else {
                    print("No root view controller available")
                }
            }
            
            return ["status": "shown"]
        }
        
        AsyncFunction("unlockAchievement") { (achievementID: String) async throws -> [String: Any] in
            let achievement = GKAchievement(identifier: achievementID)
            achievement.percentComplete = 100.0
            achievement.showsCompletionBanner = true
            
            try await GKAchievement.report([achievement])
            
            return ["status": "unlocked"]
        }
        
        AsyncFunction("incrementAchievement") { (achievementID: String, stepsIncrement: Int, totalSteps: Int) async throws -> [String: Any] in
            // Load existing achievements to get current progress
            let achievements = try await GKAchievement.loadAchievements()
            var achievement: GKAchievement? = achievements.first { $0.identifier == achievementID }
            
            // If achievement not found, create a new one
            if achievement == nil {
                achievement = GKAchievement(identifier: achievementID)
            }
            
            guard let achievement = achievement else {
                throw NSError(domain: "GameCenter", code: 500, userInfo: [
                    NSLocalizedDescriptionKey: "Failed to create or load achievement"
                ])
            }
            
            // Calculate the percent increment based on steps
            // percentIncrement = (stepsIncrement / totalSteps) * 100
            let percentIncrement = (Double(stepsIncrement) / Double(totalSteps)) * 100.0
            
            let currentProgress = achievement.percentComplete
            
            // Don't increment if already at 100%
            guard currentProgress < 100.0 else {
                return [
                    "status": "already_completed",
                    "progress": 100.0
                ]
            }
            
            let newProgress = min(100.0, currentProgress + percentIncrement)
            achievement.percentComplete = newProgress
            
            // Show completion banner only when reaching 100%
            if newProgress >= 100.0 {
                achievement.showsCompletionBanner = true
            }
            
            try await GKAchievement.report([achievement])
            
            return [
                "status": "incremented",
                "newProgress": newProgress
            ]
        }
        
        AsyncFunction("getAchievements") { () async throws -> [[String: Any]] in
            let achievements = try await GKAchievement.loadAchievements()
            let achievementDescriptions = try await GKAchievementDescription.loadAchievementDescriptions()
            
            var result: [[String: Any]] = []
            
            // Create a dictionary of achievement descriptions by ID for quick lookup
            var descriptionsDict: [String: GKAchievementDescription] = [:]
            for desc in achievementDescriptions {
                descriptionsDict[desc.identifier] = desc
            }
            
            // Process unlocked achievements
            for achievement in achievements {
                let desc = descriptionsDict[achievement.identifier]
                var achievementData: [String: Any] = [
                    "id": achievement.identifier,
                    "name": desc?.title ?? achievement.identifier,
                    "description": desc?.achievedDescription ?? desc?.unachievedDescription ?? "",
                    "unlocked": achievement.isCompleted,
                ]
                
                if achievement.isCompleted {
                    let completedDate = achievement.lastReportedDate
                    achievementData["unlockedAt"] = Int(completedDate.timeIntervalSince1970 * 1000)
                }
                
                if !achievement.isCompleted && achievement.percentComplete > 0 {
                    achievementData["progress"] = Int(achievement.percentComplete)
                }
                
                result.append(achievementData)
            }
            
            // Add achievements that are defined but not yet unlocked
            for desc in achievementDescriptions {
                let isAlreadyIncluded = achievements.contains { $0.identifier == desc.identifier }
                if !isAlreadyIncluded {
                    result.append([
                        "id": desc.identifier,
                        "name": desc.title,
                        "description": desc.unachievedDescription,
                        "unlocked": false
                    ])
                }
            }
            
            return result
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
