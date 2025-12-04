import { NativeModule, requireNativeModule } from "expo";
import { UserScore, UserInfo } from "./types";
import { TimeSpan } from "./constants";

declare class ExpoStoresGamesServicesModule extends NativeModule {
  isAuthenticated(): Promise<boolean>;
  signIn(): Promise<UserInfo>;
  showLeaderboard(leaderboardId: string, timeSpan?: TimeSpan): Promise<void>;
  submitScore(score: number, leaderboardId: string): Promise<void>;
  getUserScore(leaderboardId: string, timeSpan?: TimeSpan): Promise<UserScore | null>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoStoresGamesServicesModule>(
  "ExpoStoresGamesServices"
);
