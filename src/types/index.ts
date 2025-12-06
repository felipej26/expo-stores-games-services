export type UserInfo = {
  playerID: string;
  alias: string;
  displayName: string;
};

export type UserScore = {
  score: number;
  rank: number;
  formattedScore: string;
  context: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number; // timestamp in milliseconds
  progress?: number; // 0-100 for incremental achievements
  totalSteps?: number; // total steps for incremental achievements
};
