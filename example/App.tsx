import { hello, showLeaderboard, signIn } from "expo-stores-games-services";
import { useEffect } from "react";
import { Button, Text, View } from "react-native";

export default function App() {
  useEffect(() => {
    signIn()
      .then(() => console.log("Signed in successfully"))
      .catch((error) => console.error("Sign in failed", error));
  }, []);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Theme: {hello()}</Text>

      <Button
        title="Show Leaderboard"
        onPress={() => showLeaderboard("cryptogram.lib.main")}
      />
    </View>
  );
}
