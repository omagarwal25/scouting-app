/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  QR: undefined;
  Scanner: undefined;

  ObjectivePregame: undefined;
  ObjectiveAuto: undefined;
  ObjectiveTeleop: undefined;
  ObjectiveEndgame: undefined;
  ObjectivePostgame: undefined;
  ObjectiveInfo: undefined;
  ObjectiveOther: undefined;

  SubjectiveInfo: undefined;
  SubjectiveOther: undefined;
  SubjectiveTeam: undefined;

  PitInfo: undefined;
  PitOther: undefined;
  PitSpecifications: undefined;
  PitDrive: undefined;
  PitAuto: undefined;
  PitTeleop: undefined;
  PitEndgame: undefined;
};

export type RootTabScreenProps = NativeStackScreenProps<RootStackParamList>;
