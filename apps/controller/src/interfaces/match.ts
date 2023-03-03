export interface TBAMatch {
  actual_time: number | null;
  alliances: Alliances;
  comp_level: CompLevel;
  event_key: string;
  key: string;
  match_number: number;
  post_result_time: number | null;
  predicted_time: number;
  score_breakdown: ScoreBreakdown | null;
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
  dq_team_keys: any[];
  score: number;
  surrogate_team_keys: any[];
  team_keys: string[];
}

export type CompLevel = "ef" | "f" | "qf" | "qm" | "sf";

export interface ScoreBreakdown {
  blue: AllianceScoreBreakdown;
  red: AllianceScoreBreakdown;
}

export interface AllianceScoreBreakdown {
  activationBonusAchieved: boolean;
  adjustPoints: number; // NO;
  autoBridgeState: BridgeState;
  autoChargeStationPoints: number;
  autoChargeStationRobot1: ChargeStation;
  autoChargeStationRobot2: ChargeStation;
  autoChargeStationRobot3: ChargeStation;
  autoCommunity: Community;
  autoDocked: boolean;
  autoGamePieceCount: number;
  autoGamePiecePoints: number;
  autoMobilityPoints: number;
  autoPoints: number;
  coopGamePieceCount: number;
  coopertitionCriteriaMet: boolean;
  endGameBridgeState: BridgeState;
  endGameChargeStationPoints: number;
  endGameChargeStationRobot1: ChargeStation;
  endGameChargeStationRobot2: ChargeStation;
  endGameChargeStationRobot3: ChargeStation;
  endGameParkPoints: number; // no;
  foulCount: number;
  foulPoints: number;
  linkPoints: number;
  links: Link[]; // NO;
  mobilityRobot1: MobilityRobot;
  mobilityRobot2: MobilityRobot;
  mobilityRobot3: MobilityRobot;
  rp: number;
  sustainabilityBonusAchieved: boolean;
  techFoulCount: number;
  teleopCommunity: Community; // convert to x top, y middle, z bottom;
  teleopGamePieceCount: number;
  teleopGamePiecePoints: number;
  teleopPoints: number;
  totalChargeStationPoints: number;
  totalPoints: number;
}

export type BridgeState = "Level" | "NotLevel";
export type ChargeStation = "Docked" | "None" | "Park";

export interface Community {
  B: Node[];
  M: Node[];
  T: Node[];
}

export type Node = "Cone" | "Cube" | "None";

export interface Link {
  nodes: number[];
  row: Row;
}

export type Row = "Bottom" | "Middle" | "Top";

type MobilityRobot = "Yes" | "No";

export type WinningAlliance = "blue" | "" | "red";
