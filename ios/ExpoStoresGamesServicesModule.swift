import ExpoModulesCore
import GameKit

public class ExpoStoresGamesServicesModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoStoresGamesServices')` in JavaScript.
    Name("ExpoStoresGamesServices")
    
    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello world! 2 👋"
    }
    
    AsyncFunction("signIn") { () async throws -> [String: String] in
      let localPlayer = GKLocalPlayer.local
      
      return try await withCheckedThrowingContinuation { continuation in
        localPlayer.authenticateHandler = { viewController, error in
          if let error = error  {
            continuation.resume(throwing: error)
            return
          }
          
          if let vc = viewController {
            if let rootVC = UIApplication.shared.delegate?.window??.rootViewController {
              rootVC.present(vc, animated: true, completion: nil)
            }
            // Do not resume continuation here yet — wait until user logs in
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
      let viewController = GKGameCenterViewController(leaderboardID: leaderboardID, playerScope: .global, timeScope: .allTime)
      viewController.gameCenterDelegate = GameCenterDelegate.shared
      
      if let rootVC = UIApplication.shared.delegate?.window??.rootViewController {
        rootVC.present(viewController, animated: true, completion: nil)
      }
    }
  }
}

class GameCenterDelegate: NSObject, GKGameCenterControllerDelegate {
  static let shared = GameCenterDelegate()

  func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
    gameCenterViewController.dismiss(animated: true, completion: nil)
  }
}
