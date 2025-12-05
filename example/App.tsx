import {
  getUserScore,
  showLeaderboard,
  signIn,
  submitScore,
  isAuthenticated,
  UserScore,
  UserInfo,
} from "expo-stores-games-services";
import { useEffect, useState } from "react";
import { Alert, Button, Platform, Text, View } from "react-native";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  const leaderboardId = Platform.select({
    android: "CgkIqZTgwJgSEAIQAQ",
    default: "cryptogram.lib.main",
  });

  useEffect(() => {
    // Check authentication status first
    isAuthenticated()
      .then((authenticated) => {
        if (authenticated) {
          setIsSignedIn(true);
          // If already authenticated, try to get user info
          // Note: signIn will return user info if already signed in
          signIn()
            .then((info) => {
              setUserInfo(info);
            })
            .catch((err) => {
              console.error("Failed to get user info:", err);
            });
        } else {
          // Not authenticated, try to sign in
          signIn()
            .then((info) => {
              console.log("Signed in successfully:", info);
              setUserInfo(info);
              setIsSignedIn(true);
              setError(null);
            })
            .catch((err) => {
              console.error("Sign in failed:", err);
              setError(`Sign in failed: ${err.message || err}`);
            });
        }
      })
      .catch((err) => {
        console.error("Failed to check authentication:", err);
        setError(`Authentication check failed: ${err.message || err}`);
      });
  }, []);

  useEffect(() => {
    if (!isSignedIn || !leaderboardId) return;

    getUserScore(leaderboardId)
      .then((score) => {
        if (score) {
          console.log("User score:", score);
          setUserScore(score);
        } else {
          console.log("No score found for user");
          setUserScore(null);
        }
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to get user score:", err);
        setError(`Failed to get user score: ${err.message || err}`);
      });
  }, [isSignedIn, leaderboardId]);

  const handleShowLeaderboard = () => {
    if (!leaderboardId) {
      Alert.alert("Error", "Leaderboard ID is not set");
      return;
    }
    showLeaderboard(leaderboardId)
      .then(() => {
        console.log("Leaderboard shown");
      })
      .catch((err) => {
        console.error("Failed to show leaderboard:", err);
        Alert.alert("Error", `Failed to show leaderboard: ${err.message || err}`);
      });
  };

  const handleSubmitScore = () => {
    if (!leaderboardId) {
      Alert.alert("Error", "Leaderboard ID is not set");
      return;
    }
    submitScore(120, leaderboardId)
      .then(() => {
        console.log("Score submitted successfully");
        Alert.alert("Success", "Score submitted successfully");
        // Refresh user score after submission
        getUserScore(leaderboardId)
          .then((score) => {
            if (score) {
              setUserScore(score);
            }
          })
          .catch((err) => {
            console.error("Failed to refresh score:", err);
          });
      })
      .catch((err) => {
        console.error("Failed to submit score:", err);
        Alert.alert("Error", `Failed to submit score: ${err.message || err}`);
      });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
      {error && (
        <View style={{ marginBottom: 20, padding: 10, backgroundColor: "#ffebee", borderRadius: 5 }}>
          <Text style={{ color: "#c62828" }}>{error}</Text>
        </View>
      )}

      {isSignedIn ? (
        <>
          {userInfo && (
            <View style={{ marginBottom: 20, alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>User Info</Text>
              <Text>Player ID: {userInfo.playerID}</Text>
              <Text>Display Name: {userInfo.displayName}</Text>
              <Text>Alias: {userInfo.alias}</Text>
            </View>
          )}

          <Button title="Show Leaderboard" onPress={handleShowLeaderboard} />

          <View style={{ height: 10 }} />

          <Button title="Submit Score (120)" onPress={handleSubmitScore} />

          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>User Score</Text>
            {userScore ? (
              <>
                <Text>Score: {userScore.score}</Text>
                <Text>Rank: {userScore.rank}</Text>
                <Text>Formatted: {userScore.formattedScore}</Text>
                <Text>Context: {userScore.context}</Text>
              </>
            ) : (
              <Text>No score available</Text>
            )}
          </View>
        </>
      ) : (
        <Text>Loading or signing in...</Text>
      )}
    </View>
  );
}
