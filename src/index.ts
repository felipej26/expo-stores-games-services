// Reexport the native module. On web, it will be resolved to ExpoStoresGamesServicesModule.web.ts
import ExpoStoresGamesServicesModule from "./ExpoStoresGamesServicesModule";

export function signIn(): Promise<void> {
  return ExpoStoresGamesServicesModule.signIn();
}

export function showLeaderboard(leaderboardId: string): Promise<void> {
  return ExpoStoresGamesServicesModule.showLeaderboard(leaderboardId);
}

export function submitScore(
  score: number,
  leaderboardId: string
): Promise<void> {
  return ExpoStoresGamesServicesModule.submitScore(score, leaderboardId);
}

export function getUserScore(leaderboardId: string): Promise<{
  score: number;
  rank: number;
  formattedScore: string;
  context: any;
}> {
  return ExpoStoresGamesServicesModule.getUserScore(leaderboardId);
}
