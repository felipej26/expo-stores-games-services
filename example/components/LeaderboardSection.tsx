import React from "react";
import { Button, Text, View } from "react-native";
import { UserScore } from "expo-stores-games-services";

interface LeaderboardSectionProps {
  userScore: UserScore | null;
  onShowLeaderboard: () => void;
  onSubmitScore: () => void;
}

export default function LeaderboardSection({
  userScore,
  onShowLeaderboard,
  onSubmitScore,
}: LeaderboardSectionProps) {
  return (
    <View style={{ width: "100%", marginBottom: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Leaderboards
      </Text>
      <Button title="Show Leaderboard" onPress={onShowLeaderboard} />
      <View style={{ height: 10 }} />
      <Button title="Submit Score (120)" onPress={onSubmitScore} />
      <View style={{ marginTop: 10, alignItems: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>User Score</Text>
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
  );
}
