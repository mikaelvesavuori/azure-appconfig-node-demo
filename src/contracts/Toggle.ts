export type Toggle = {
  id: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  isActiveForCurrentUser: boolean;
};
