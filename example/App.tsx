import {
  showLeaderboard,
  signIn,
  submitScore,
} from "expo-stores-games-services";
import { useEffect } from "react";
import { Button, View } from "react-native";

export default function App() {
  useEffect(() => {
    signIn()
      .then(() => console.log("Signed in successfully"))
      .catch((error) => console.error("Sign in failed", error));
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title="Show Leaderboard"
        onPress={() => showLeaderboard("cryptogram.lib.main")}
      />

      <Button
        title="Submit Score"
        onPress={() => submitScore(80, "cryptogram.lib.main")}
      />
    </View>
  );
}
