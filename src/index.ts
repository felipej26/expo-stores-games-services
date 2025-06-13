import { TimeSpan } from "./constants";
import ExpoStoresGamesServicesModule from "./ExpoStoresGamesServicesModule";
import { UserScore } from "./types";

export function signIn(): Promise<void> {
  return ExpoStoresGamesServicesModule.signIn();
}

export function showLeaderboard(
  leaderboardId: string,
  timeSpan = TimeSpan.ALL_TIME
): Promise<void> {
  return ExpoStoresGamesServicesModule.showLeaderboard(leaderboardId, timeSpan);
}

export function submitScore(
  score: number,
  leaderboardId: string
): Promise<void> {
  return ExpoStoresGamesServicesModule.submitScore(score, leaderboardId);
}

export function getUserScore(leaderboardId: string): Promise<UserScore> {
  return ExpoStoresGamesServicesModule.getUserScore(leaderboardId);
}
