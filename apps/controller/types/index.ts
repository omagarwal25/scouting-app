import {
  SubjectiveInfo,
  SubjectiveOther,
  SubjectiveTeam,
} from "@griffins-scout/game";

export type DBSubjectiveRecord = {
  other: SubjectiveOther;
  info: Omit<
    SubjectiveInfo,
    "teamOneNumber" | "teamTwoNumber" | "teamThreeNumber"
  > & { teamNumber: number };
  team: SubjectiveTeam;
};
