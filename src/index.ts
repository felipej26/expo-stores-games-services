import { TimeSpan } from "./constants";
import ExpoStoresGamesServicesModule from "./ExpoStoresGamesServicesModule";
import { UserScore, UserInfo } from "./types";

export * from "./constants";
export * from "./types";

export function isAuthenticated(): Promise<boolean> {
  return ExpoStoresGamesServicesModule.isAuthenticated();
}

export function signIn(): Promise<UserInfo> {
  return ExpoStoresGamesServicesModule.signIn();
}

export function showLeaderboard(
  leaderboardId: string,
  timeSpan = TimeSpan.ALL_TIME
): Promise<void> {
  if (!leaderboardId || leaderboardId.trim().length === 0) {
    throw new Error("leaderboardId cannot be empty");
  }
  return ExpoStoresGamesServicesModule.showLeaderboard(leaderboardId, timeSpan);
}

export function submitScore(
  score: number,
  leaderboardId: string
): Promise<void> {
  if (!leaderboardId || leaderboardId.trim().length === 0) {
    throw new Error("leaderboardId cannot be empty");
  }
  if (typeof score !== "number" || isNaN(score) || !isFinite(score)) {
    throw new Error("score must be a valid number");
  }
  if (score < 0) {
    throw new Error("score cannot be negative");
  }
  return ExpoStoresGamesServicesModule.submitScore(score, leaderboardId);
}

export function getUserScore(
  leaderboardId: string,
  timeSpan = TimeSpan.ALL_TIME
): Promise<UserScore | null> {
  if (!leaderboardId || leaderboardId.trim().length === 0) {
    throw new Error("leaderboardId cannot be empty");
  }
  return ExpoStoresGamesServicesModule.getUserScore(leaderboardId, timeSpan);
}
