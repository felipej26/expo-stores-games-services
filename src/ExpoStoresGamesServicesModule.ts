import { NativeModule, requireNativeModule } from "expo";

type UserScore = {
  score: number;
  rank: number;
  formattedScore: string;
  context: any;
};

declare class ExpoStoresGamesServicesModule extends NativeModule {
  signIn(): Promise<void>;
  showLeaderboard(leaderboardId: string): void;
  submitScore(score: number, leaderboardId: string): void;
  getUserScore(leaderboardId: string): Promise<UserScore>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoStoresGamesServicesModule>(
  "ExpoStoresGamesServices"
);
