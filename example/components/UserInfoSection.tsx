import React from "react";
import { Text, View } from "react-native";
import { UserInfo } from "expo-stores-games-services";

interface UserInfoSectionProps {
  userInfo: UserInfo | null;
}

export default function UserInfoSection({ userInfo }: UserInfoSectionProps) {
  if (!userInfo) return null;

  return (
    <View
      style={{
        marginBottom: 20,
        alignItems: "center",
        width: "100%",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>User Info</Text>
      <Text>Player ID: {userInfo.playerID}</Text>
      <Text>Display Name: {userInfo.displayName}</Text>
      <Text>Alias: {userInfo.alias}</Text>
    </View>
  );
}
