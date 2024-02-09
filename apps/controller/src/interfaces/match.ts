export interface TBAMatch {
  actual_time: number | null;
  alliances: Alliances;
  comp_level: CompLevel;
  event_key: string;
  key: string;
  match_number: number;
  post_result_time: number | null;
  predicted_time: number;
  score_breakdown: unknown;
  set_number: number;
  time: number;
  videos: any[];
  winning_alliance: WinningAlliance;
}

export interface Alliances {
  blue: AlliancesBlue;
  red: AlliancesBlue;
}

export interface AlliancesBlue {
  dq_team_keys: string[];
  score: number;
  surrogate_team_keys: string[];
  team_keys: string[];
}

export type CompLevel = "ef" | "f" | "qf" | "qm" | "sf";

export type WinningAlliance = "blue" | "" | "red";
