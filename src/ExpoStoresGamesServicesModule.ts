import { NativeModule, requireNativeModule } from "expo";

declare class ExpoStoresGamesServicesModule extends NativeModule {
  hello(): string;
  signIn(): Promise<void>;
  showLeaderboard(leaderboardId: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoStoresGamesServicesModule>(
  "ExpoStoresGamesServices"
);
