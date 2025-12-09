import React from "react";
import { Button, Text, View } from "react-native";
import { Achievement } from "expo-stores-games-services";
import AchievementActionsSection from "./AchievementActionsSection";
import AchievementList from "./AchievementList";

interface AchievementsSectionProps {
  achievementId: string;
  exampleAchievementId: string;
  achievements: Achievement[];
  onAchievementIdChange: (id: string) => void;
  onShowAchievements: () => void;
  onReloadAchievements: () => void;
  onUnlockAchievement: () => void;
  onIncrementAchievement: (stepsIncrement: number, totalSteps: number) => void;
}

export default function AchievementsSection({
  achievementId,
  exampleAchievementId,
  achievements,
  onAchievementIdChange,
  onShowAchievements,
  onReloadAchievements,
  onUnlockAchievement,
  onIncrementAchievement,
}: AchievementsSectionProps) {
  return (
    <View
      style={{
        width: "100%",
        marginBottom: 20,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        paddingTop: 20,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Achievements
      </Text>

      <Button title="Show Achievements" onPress={onShowAchievements} />
      <View style={{ height: 10 }} />
      <Button title="Reload Achievements" onPress={onReloadAchievements} />

      <AchievementActionsSection
        achievementId={achievementId}
        exampleAchievementId={exampleAchievementId}
        onAchievementIdChange={onAchievementIdChange}
        onUnlock={onUnlockAchievement}
        onIncrement={onIncrementAchievement}
      />

      <AchievementList achievements={achievements} />
    </View>
  );
}
