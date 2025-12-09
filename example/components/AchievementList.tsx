import React from "react";
import { Text, View } from "react-native";
import { Achievement } from "expo-stores-games-services";
import AchievementItem from "./AchievementItem";

interface AchievementListProps {
  achievements: Achievement[];
}

export default function AchievementList({
  achievements,
}: AchievementListProps) {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
        My Achievements ({achievements.length})
      </Text>
      {achievements.length > 0 ? (
        achievements.map((achievement) => (
          <AchievementItem key={achievement.id} achievement={achievement} />
        ))
      ) : (
        <Text style={{ color: "#666" }}>No achievements found</Text>
      )}
    </View>
  );
}
