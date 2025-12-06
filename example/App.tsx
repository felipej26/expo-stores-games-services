import {
  getUserScore,
  showLeaderboard,
  signIn,
  submitScore,
  isAuthenticated,
  showAchievements,
  unlockAchievement,
  incrementAchievement,
  getAchievements,
  UserScore,
  UserInfo,
  Achievement,
} from "expo-stores-games-services";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [achievementId, setAchievementId] = useState("");
  const [incrementSteps, setIncrementSteps] = useState("1");

  const leaderboardId = Platform.select({
    android: "CgkIqZTgwJgSEAIQAQ",
    default: "cryptogram.lib.main",
  });

  // Example achievement IDs - replace with your actual achievement IDs
  const exampleAchievementId = Platform.select({
    android: "CgkIqZTgwJgSEAIQEg", // Replace with your Android achievement ID
    default: "cryptogram_achi_001", // Replace with your iOS achievement ID
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

    // Load achievements when signed in
    loadAchievements();
  }, [isSignedIn, leaderboardId]);

  const loadAchievements = () => {
    getAchievements()
      .then((achievementsList) => {
        console.log("Achievements loaded:", achievementsList);
        setAchievements(achievementsList);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load achievements:", err);
        setError(`Failed to load achievements: ${err.message || err}`);
      });
  };

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
        Alert.alert(
          "Error",
          `Failed to show leaderboard: ${err.message || err}`
        );
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

  const handleShowAchievements = () => {
    showAchievements()
      .then(() => {
        console.log("Achievements shown");
        // Reload achievements after showing (user might have unlocked some)
        setTimeout(() => {
          loadAchievements();
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to show achievements:", err);
        Alert.alert(
          "Error",
          `Failed to show achievements: ${err.message || err}`
        );
      });
  };

  const handleUnlockAchievement = () => {
    const id = achievementId.trim() || exampleAchievementId;
    if (!id) {
      Alert.alert("Error", "Achievement ID is required");
      return;
    }
    unlockAchievement(id)
      .then(() => {
        console.log("Achievement unlocked successfully");
        Alert.alert("Success", `Achievement "${id}" unlocked successfully`);
        loadAchievements();
      })
      .catch((err) => {
        console.error("Failed to unlock achievement:", err);
        Alert.alert(
          "Error",
          `Failed to unlock achievement: ${err.message || err}`
        );
      });
  };

  const handleIncrementAchievement = () => {
    const id = achievementId.trim() || exampleAchievementId;
    if (!id) {
      Alert.alert("Error", "Achievement ID is required");
      return;
    }
    const steps = parseInt(incrementSteps, 10);
    if (isNaN(steps) || steps <= 0) {
      Alert.alert("Error", "Steps must be a positive number");
      return;
    }
    incrementAchievement(id, steps)
      .then(() => {
        console.log(`Achievement "${id}" incremented by ${steps}`);
        Alert.alert("Success", `Achievement incremented by ${steps} steps`);
        loadAchievements();
      })
      .catch((err) => {
        console.error("Failed to increment achievement:", err);
        Alert.alert(
          "Error",
          `Failed to increment achievement: ${err.message || err}`
        );
      });
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {error && (
        <View
          style={{
            marginBottom: 20,
            padding: 10,
            backgroundColor: "#ffebee",
            borderRadius: 5,
            width: "100%",
          }}
        >
          <Text style={{ color: "#c62828" }}>{error}</Text>
        </View>
      )}

      {isSignedIn ? (
        <>
          {userInfo && (
            <View
              style={{ marginBottom: 20, alignItems: "center", width: "100%" }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                User Info
              </Text>
              <Text>Player ID: {userInfo.playerID}</Text>
              <Text>Display Name: {userInfo.displayName}</Text>
              <Text>Alias: {userInfo.alias}</Text>
            </View>
          )}

          <View style={{ width: "100%", marginBottom: 20 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Leaderboards
            </Text>
            <Button title="Show Leaderboard" onPress={handleShowLeaderboard} />
            <View style={{ height: 10 }} />
            <Button title="Submit Score (120)" onPress={handleSubmitScore} />
            <View style={{ marginTop: 10, alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                User Score
              </Text>
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
          </View>

          <View
            style={{
              width: "100%",
              marginBottom: 20,
              borderTopWidth: 1,
              borderTopColor: "#ccc",
              paddingTop: 20,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Achievements
            </Text>

            <Button
              title="Show Achievements"
              onPress={handleShowAchievements}
            />
            <View style={{ height: 10 }} />
            <Button title="Reload Achievements" onPress={loadAchievements} />

            <View style={{ marginTop: 20, marginBottom: 20 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                Achievement Actions
              </Text>

              <Text style={{ marginBottom: 5, fontSize: 14 }}>
                Achievement ID:
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 10,
                  backgroundColor: "#fff",
                }}
                placeholder={exampleAchievementId || "Enter achievement ID"}
                value={achievementId}
                onChangeText={setAchievementId}
              />

              <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Unlock Achievement"
                    onPress={handleUnlockAchievement}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text style={{ marginRight: 10, fontSize: 14 }}>Steps:</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 5,
                    padding: 10,
                    width: 80,
                    backgroundColor: "#fff",
                  }}
                  placeholder="1"
                  value={incrementSteps}
                  onChangeText={setIncrementSteps}
                  keyboardType="numeric"
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Button
                    title="Increment Achievement"
                    onPress={handleIncrementAchievement}
                  />
                </View>
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                My Achievements ({achievements.length})
              </Text>
              {achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <View
                    key={achievement.id}
                    style={{
                      padding: 10,
                      marginBottom: 10,
                      backgroundColor: achievement.unlocked
                        ? "#e8f5e9"
                        : "#f5f5f5",
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: achievement.unlocked ? "#4caf50" : "#ccc",
                    }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                      {achievement.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                      {achievement.description}
                    </Text>
                    <Text style={{ fontSize: 12, marginTop: 5 }}>
                      Status:{" "}
                      {achievement.unlocked ? "✅ Unlocked" : "🔒 Locked"}
                    </Text>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <Text
                        style={{ fontSize: 11, color: "#666", marginTop: 2 }}
                      >
                        Unlocked:{" "}
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </Text>
                    )}
                    {achievement.progress !== undefined &&
                      achievement.totalSteps !== undefined && (
                        <Text style={{ fontSize: 12, marginTop: 5 }}>
                          Progress: {achievement.progress} /{" "}
                          {achievement.totalSteps} steps
                        </Text>
                      )}
                    {achievement.progress !== undefined &&
                      achievement.totalSteps === undefined && (
                        <Text style={{ fontSize: 12, marginTop: 5 }}>
                          Progress: {achievement.progress}%
                        </Text>
                      )}
                    <Text style={{ fontSize: 10, color: "#999", marginTop: 5 }}>
                      ID: {achievement.id}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: "#666" }}>No achievements found</Text>
              )}
            </View>
          </View>
        </>
      ) : (
        <Text>Loading or signing in...</Text>
      )}
    </ScrollView>
  );
}
