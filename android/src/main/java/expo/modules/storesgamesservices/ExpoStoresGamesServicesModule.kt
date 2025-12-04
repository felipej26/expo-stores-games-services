package expo.modules.storesgamesservices

import com.google.android.gms.games.GamesSignInClient
import com.google.android.gms.games.PlayGames
import com.google.android.gms.games.Player
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoStoresGamesServicesModule : Module() {
  private var pendingPromise: Promise? = null
  private val RC_LEADERBOARD_UI: Int = 9004

  override fun definition() = ModuleDefinition {
    Name("ExpoStoresGamesServices")

    OnActivityResult { activity, payload ->
      val requestCode = payload.requestCode
      val resultCode = payload.resultCode
      val data = payload.data

      when(requestCode) {
        RC_LEADERBOARD_UI -> {
          pendingPromise?.resolve()
          pendingPromise = null
        }
      }
    }

    AsyncFunction("isAuthenticated") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("NO_ACTIVITY", "No current activity", null)
        return@AsyncFunction
      }

      val gamesSignInClient: GamesSignInClient = PlayGames.getGamesSignInClient(activity)

      gamesSignInClient.isAuthenticated().addOnCompleteListener { isAuthenticatedTask ->
        if (isAuthenticatedTask.isSuccessful) {
          val isAuthenticated = isAuthenticatedTask.result.isAuthenticated
          promise.resolve(isAuthenticated)
        } else {
          promise.reject("AUTHENTICATION_ERROR", "Failed to check authentication status", null)
        }
      }
    }

    AsyncFunction("signIn") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("NO_ACTIVITY", "No current activity", null)
        return@AsyncFunction
      }

      val gamesSignInClient: GamesSignInClient = PlayGames.getGamesSignInClient(activity)

      gamesSignInClient.signIn().addOnCompleteListener { signInTask ->
        if (signInTask.isSuccessful) {
          // Get player information after successful sign in
          val playersClient = PlayGames.getPlayersClient(activity)
          playersClient.currentPlayer.addOnCompleteListener { playerTask ->
            if (playerTask.isSuccessful) {
              val player: Player = playerTask.result
              val userInfo = mapOf(
                "playerID" to player.playerId,
                "alias" to (player.alias ?: ""),
                "displayName" to player.displayName
              )
              promise.resolve(userInfo)
            } else {
              promise.reject("GET_PLAYER_INFO_FAILED", "Failed to get player information", null)
            }
          }
        } else {
          promise.reject("SIGN_IN_FAILED", "Failed to sign in", null)
        }
      }
    }

    AsyncFunction("showLeaderboard") { leaderboardId: String, timeSpan: Int, promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("NO_ACTIVITY", "No current activity", null)
        return@AsyncFunction
      }

      PlayGames.getLeaderboardsClient(activity)
        .getLeaderboardIntent(leaderboardId, timeSpan)
        .addOnSuccessListener { intent ->
          pendingPromise = promise
          activity.startActivityForResult(intent, RC_LEADERBOARD_UI)
        }
        .addOnFailureListener { exception ->
          promise.reject("SHOW_LEADERBOARD_FAILED", "Failed to show leaderboard: ${exception.message}", exception)
        }
    }


    AsyncFunction("submitScore") { score: Long, leaderboardID: String, promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("NO_ACTIVITY", "No current activity", null)
        return@AsyncFunction
      }

      PlayGames.getLeaderboardsClient(activity)
        .submitScore(leaderboardID, score);

      promise.resolve()
    }

    AsyncFunction("getUserScore") { leaderboardID: String, timeSpan: Int, promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("NO_ACTIVITY", "No current activity", null)
        return@AsyncFunction
      }

      PlayGames.getLeaderboardsClient(activity)
        .loadCurrentPlayerLeaderboardScore(leaderboardID, timeSpan, 0)
        .addOnSuccessListener { intent ->
          val scoreData = intent.get()

          if (scoreData != null) {
            val result = mapOf(
              "score" to scoreData.rawScore,
              "rank" to scoreData.rank,
              "formattedScore" to scoreData.displayScore,
              "context" to 0L,
            )
            promise.resolve(result)
          } else {
            promise.resolve(null)
          }
        }
        .addOnFailureListener { exception ->
          promise.reject("GET_USER_SCORE_FAILED", "Failed to get user score: ${exception.message}", exception)
        }
    }
  }
}
