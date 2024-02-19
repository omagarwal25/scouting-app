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
  dq_team_keys: string[];
  score: number;
  surrogate_team_keys: string[];
  team_keys: string[];
}

export type CompLevel = "ef" | "f" | "qf" | "qm" | "sf";

export type WinningAlliance = "blue" | "" | "red";

export interface ScoreBreakdown {
  blue: AllianceScoreBreakdown;
  red: AllianceScoreBreakdown
}

export interface AllianceScoreBreakdown {
  adjustPoints: number
  autoAmpNoteCount: number
  autoAmpNotePoints: number
  autoLeavePoints: number
  autoLineRobot1: string
  autoLineRobot2: string
  autoLineRobot3: string
  autoPoints: number
  autoSpeakerNoteCount: number
  autoSpeakerNotePoints: number
  autoTotalNotePoints: number
  coopNotePlayed: boolean
  coopertitionBonusAchieved: boolean
  coopertitionCriteriaMet: boolean
  endGameHarmonyPoints: number
  endGameNoteInTrapPoints: number
  endGameOnStagePoints: number
  endGameParkPoints: number
  endGameRobot1: string
  endGameRobot2: string
  endGameRobot3: string
  endGameSpotLightBonusPoints: number
  endGameTotalStagePoints: number
  ensembleBonusAchieved: boolean
  ensembleBonusOnStageRobotsThreshold: number
  ensembleBonusStagePointsThreshold: number
  foulCount: number
  foulPoints: number
  g206Penalty: boolean
  g408Penalty: boolean
  g424Penalty: boolean
  melodyBonusAchieved: boolean
  melodyBonusThreshold: number
  melodyBonusThresholdCoop: number
  melodyBonusThresholdNonCoop: number
  micCenterStage: boolean
  micStageLeft: boolean
  micStageRight: boolean
  rp: number
  techFoulCount: number
  teleopAmpNoteCount: number
  teleopAmpNotePoints: number
  teleopPoints: number
  teleopSpeakerNoteAmplifiedCount: number
  teleopSpeakerNoteAmplifiedPoints: number
  teleopSpeakerNoteCount: number
  teleopSpeakerNotePoints: number
  teleopTotalNotePoints: number
  totalPoints: number
  trapCenterStage: boolean
  trapStageLeft: boolean
  trapStageRight: boolean
}
