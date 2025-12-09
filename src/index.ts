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
  stepsIncrement: number,
  totalSteps: number
): Promise<void> {
  if (!achievementId || achievementId.trim().length === 0) {
    throw new Error("achievementId cannot be empty");
  }
  if (
    typeof stepsIncrement !== "number" ||
    isNaN(stepsIncrement) ||
    !isFinite(stepsIncrement)
  ) {
    throw new Error("stepsIncrement must be a valid number");
  }
  if (
    typeof totalSteps !== "number" ||
    isNaN(totalSteps) ||
    !isFinite(totalSteps)
  ) {
    throw new Error("totalSteps must be a valid number");
  }
  if (stepsIncrement <= 0) {
    throw new Error("stepsIncrement must be greater than 0");
  }
  if (totalSteps <= 0) {
    throw new Error("totalSteps must be greater than 0");
  }
  if (stepsIncrement !== Math.floor(stepsIncrement)) {
    throw new Error("stepsIncrement must be an integer");
  }
  if (totalSteps !== Math.floor(totalSteps)) {
    throw new Error("totalSteps must be an integer");
  }
  if (stepsIncrement > totalSteps) {
    throw new Error("stepsIncrement cannot be greater than totalSteps");
  }
  return ExpoStoresGamesServicesModule.incrementAchievement(
    achievementId,
    stepsIncrement,
    totalSteps
  );
}

export function getAchievements(): Promise<Achievement[]> {
  return ExpoStoresGamesServicesModule.getAchievements();
}
