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
