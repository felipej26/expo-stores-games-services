import React from "react";
import { Text, View } from "react-native";

interface ErrorDisplayProps {
  error: string | null;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return (
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
  );
}
