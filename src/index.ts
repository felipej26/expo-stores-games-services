import { TimeSpan } from "./constants";
import ExpoStoresGamesServicesModule from "./ExpoStoresGamesServicesModule";
import { UserScore, UserInfo, Achievement } from "./types";

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

export function showAchievements(): Promise<void> {
  return ExpoStoresGamesServicesModule.showAchievements();
}

export function unlockAchievement(achievementId: string): Promise<void> {
  if (!achievementId || achievementId.trim().length === 0) {
    throw new Error("achievementId cannot be empty");
  }
  return ExpoStoresGamesServicesModule.unlockAchievement(achievementId);
}

export function incrementAchievement(
  achievementId: string,
  steps: number = 1
): Promise<void> {
  if (!achievementId || achievementId.trim().length === 0) {
    throw new Error("achievementId cannot be empty");
  }
  if (typeof steps !== "number" || isNaN(steps) || !isFinite(steps)) {
    throw new Error("steps must be a valid number");
  }
  if (steps <= 0) {
    throw new Error("steps must be greater than 0");
  }
  if (steps !== Math.floor(steps)) {
    throw new Error("steps must be an integer");
  }
  return ExpoStoresGamesServicesModule.incrementAchievement(achievementId, steps);
}

export function getAchievements(): Promise<Achievement[]> {
  return ExpoStoresGamesServicesModule.getAchievements();
}
