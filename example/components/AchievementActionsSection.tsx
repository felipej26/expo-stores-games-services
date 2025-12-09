import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

interface AchievementActionsSectionProps {
  achievementId: string;
  exampleAchievementId: string;
  onAchievementIdChange: (id: string) => void;
  onUnlock: () => void;
  onIncrement: (stepsIncrement: number, totalSteps: number) => void;
}

export default function AchievementActionsSection({
  achievementId,
  exampleAchievementId,
  onAchievementIdChange,
  onUnlock,
  onIncrement,
}: AchievementActionsSectionProps) {
  const [incrementSteps, setIncrementSteps] = useState("1");
  const [totalSteps, setTotalSteps] = useState("10");

  const handleIncrement = () => {
    const steps = parseInt(incrementSteps, 10);
    const total = parseInt(totalSteps, 10);
    if (isNaN(steps) || steps <= 0) {
      Alert.alert("Error", "Steps increment must be a positive number");
      return;
    }
    if (isNaN(total) || total <= 0) {
      Alert.alert("Error", "Total steps must be a positive number");
      return;
    }
    if (steps > total) {
      Alert.alert(
        "Error",
        "Steps increment cannot be greater than total steps"
      );
      return;
    }
    onIncrement(steps, total);
  };

  return (
    <View style={{ marginTop: 20, marginBottom: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
        Achievement Actions
      </Text>

      <Text style={{ marginBottom: 5, fontSize: 14 }}>Achievement ID:</Text>
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
        onChangeText={onAchievementIdChange}
      />

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
        <View style={{ flex: 1 }}>
          <Button title="Unlock Achievement" onPress={onUnlock} />
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
        <Text style={{ marginLeft: 10, marginRight: 10, fontSize: 14 }}>
          Total:
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            padding: 10,
            width: 80,
            backgroundColor: "#fff",
          }}
          placeholder="10"
          value={totalSteps}
          onChangeText={setTotalSteps}
          keyboardType="numeric"
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Button title="Increment Achievement" onPress={handleIncrement} />
        </View>
      </View>
    </View>
  );
}
