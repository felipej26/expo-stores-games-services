package expo.modules.storesgamesservices

import com.google.android.gms.games.GamesSignInClient
import com.google.android.gms.games.PlayGames
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

    AsyncFunction("signIn") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("NO_ACTIVITY", "No current activity", null)
          return@AsyncFunction
      }

      val gamesSignInClient: GamesSignInClient = PlayGames.getGamesSignInClient(activity)

      gamesSignInClient.isAuthenticated().addOnCompleteListener { isAuthenticatedTask ->
        val isAuthenticated = (isAuthenticatedTask.isSuccessful && isAuthenticatedTask.result.isAuthenticated)

        if (isAuthenticated) {
          promise.resolve("ALREADY_SIGNED_IN")
        } else {
          gamesSignInClient.signIn().addOnCompleteListener { signInTask ->
            if (signInTask.isSuccessful) {
              promise.resolve("SIGNED_IN_SUCCESSFULLY")
            } else {
              promise.reject("SIGN_IN_FAILED", "Failed to sign in", null)
            }
          }
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
              "context" to scoreData,
            )
            promise.resolve(result)
          } else {
            promise.resolve(null)
          }
        }
    }
  }
}
