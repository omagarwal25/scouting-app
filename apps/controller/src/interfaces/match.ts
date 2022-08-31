export interface TBAMatch {
  actual_time: number;
  alliances: Alliances;
  comp_level: CompLevel;
  event_key: string;
  key: string;
  match_number: number;
  post_result_time: number;
  predicted_time: number;
  score_breakdown: ScoreBreakdown;
  set_number: number;
  time: number;
  videos: Video[];
  winning_alliance: WinningAlliance;
}

interface Alliances {
  blue: AlliancesBlue;
  red: AlliancesBlue;
}

interface AlliancesBlue {
  dq_team_keys: string[];
  score: number;
  surrogate_team_keys: any[];
  team_keys: string[];
}

type CompLevel = "f" | "qf" | "qm" | "sf";

interface ScoreBreakdown {
  blue: ScoreBreakdownBlue;
  red: ScoreBreakdownBlue;
}

interface ScoreBreakdownBlue {
  adjustPoints: number;
  autoCargoLowerBlue: number;
  autoCargoLowerFar: number;
  autoCargoLowerNear: number;
  autoCargoLowerRed: number;
  autoCargoPoints: number;
  autoCargoTotal: number;
  autoCargoUpperBlue: number;
  autoCargoUpperFar: number;
  autoCargoUpperNear: number;
  autoCargoUpperRed: number;
  autoPoints: number;
  autoTaxiPoints: number;
  cargoBonusRankingPoint: boolean;
  endgamePoints: number;
  endgameRobot1: EndgameRobot;
  endgameRobot2: EndgameRobot;
  endgameRobot3: EndgameRobot;
  foulCount: number;
  foulPoints: number;
  hangarBonusRankingPoint: boolean;
  matchCargoTotal: number;
  quintetAchieved: boolean;
  rp: number;
  taxiRobot1: TaxiRobot;
  taxiRobot2: TaxiRobot;
  taxiRobot3: TaxiRobot;
  techFoulCount: number;
  teleopCargoLowerBlue: number;
  teleopCargoLowerFar: number;
  teleopCargoLowerNear: number;
  teleopCargoLowerRed: number;
  teleopCargoPoints: number;
  teleopCargoTotal: number;
  teleopCargoUpperBlue: number;
  teleopCargoUpperFar: number;
  teleopCargoUpperNear: number;
  teleopCargoUpperRed: number;
  teleopPoints: number;
  totalPoints: number;
}

enum EndgameRobot {
  High = "High",
  Low = "Low",
  Mid = "Mid",
  None = "None",
  Traversal = "Traversal",
}

enum TaxiRobot {
  No = "No",
  Yes = "Yes",
}

interface Video {
  key: string;
  type: Type;
}

enum Type {
  Youtube = "youtube",
}

enum WinningAlliance {
  Blue = "blue",
  Empty = "",
  Red = "red",
}
