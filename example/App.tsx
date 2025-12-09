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
import { Alert, Platform, SafeAreaView, ScrollView, Text } from "react-native";
import ErrorDisplay from "./components/ErrorDisplay";
import UserInfoSection from "./components/UserInfoSection";
import LeaderboardSection from "./components/LeaderboardSection";
import AchievementsSection from "./components/AchievementsSection";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [achievementId, setAchievementId] = useState("");

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

  const handleIncrementAchievement = (
    stepsIncrement: number,
    totalSteps: number
  ) => {
    const id = achievementId.trim() || exampleAchievementId;
    if (!id) {
      Alert.alert("Error", "Achievement ID is required");
      return;
    }
    incrementAchievement(id, stepsIncrement, totalSteps)
      .then(() => {
        console.log(
          `Achievement "${id}" incremented by ${stepsIncrement} out of ${totalSteps} steps`
        );
        Alert.alert(
          "Success",
          `Achievement incremented by ${stepsIncrement} out of ${totalSteps} steps`
        );
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <ErrorDisplay error={error} />

        {isSignedIn ? (
          <>
            <UserInfoSection userInfo={userInfo} />

            <LeaderboardSection
              userScore={userScore}
              onShowLeaderboard={handleShowLeaderboard}
              onSubmitScore={handleSubmitScore}
            />

            <AchievementsSection
              achievementId={achievementId}
              exampleAchievementId={exampleAchievementId}
              achievements={achievements}
              onAchievementIdChange={setAchievementId}
              onShowAchievements={handleShowAchievements}
              onReloadAchievements={loadAchievements}
              onUnlockAchievement={handleUnlockAchievement}
              onIncrementAchievement={handleIncrementAchievement}
            />
          </>
        ) : (
          <Text>Loading or signing in...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
