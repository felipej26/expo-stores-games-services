import {
  getUserScore,
  showLeaderboard,
  signIn,
  submitScore,
} from "expo-stores-games-services";
import { useEffect, useState } from "react";
import { Button, Platform, Text, View } from "react-native";
import { UserScore } from "./types";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userScore, setUserScore] = useState<UserScore>();

  const leaderboardId = Platform.select({
    android: "CgkIqZTgwJgSEAIQAQ",
    default: "cryptogram.lib.main",
  });

  useEffect(() => {
    signIn()
      .then(() => {
        console.log("Signed in successfully");
        setIsSignedIn(true);
      })
      .catch((error) => console.error("Sign in failed", error));
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;

    getUserScore(leaderboardId)
      .then((user) => {
        console.log("User score:", { user });
        setUserScore(user);
      })
      .catch((error) => console.error("Failed to get user score", error));
  }, [isSignedIn]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {isSignedIn ? (
        <>
          <Button
            title="Show Leaderboard"
            onPress={() => showLeaderboard(leaderboardId)}
          />

          <Button
            title="Submit Score"
            onPress={() => submitScore(120, leaderboardId)}
          />

          <Text>{userScore?.score}</Text>
          <Text>{userScore?.rank}</Text>
          <Text>{userScore?.formattedScore}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
