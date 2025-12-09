import React from "react";
import { Text, View } from "react-native";
import { Achievement } from "expo-stores-games-services";

interface AchievementItemProps {
  achievement: Achievement;
}

export default function AchievementItem({ achievement }: AchievementItemProps) {
  return (
    <View
      style={{
        padding: 10,
        marginBottom: 10,
        backgroundColor: achievement.unlocked ? "#e8f5e9" : "#f5f5f5",
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
        Status: {achievement.unlocked ? "✅ Unlocked" : "🔒 Locked"}
      </Text>
      {achievement.unlocked && achievement.unlockedAt && (
        <Text style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
        </Text>
      )}
      {achievement.progress !== undefined &&
        achievement.totalSteps !== undefined && (
          <Text style={{ fontSize: 12, marginTop: 5 }}>
            Progress: {achievement.progress} / {achievement.totalSteps} steps
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
  );
}
