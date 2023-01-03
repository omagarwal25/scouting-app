import { scoringCardFactory } from '~/components/input/ScoringCard';
import {
  game,
  objectiveAutoKeys,
  objectiveAutoSchema,
  objectiveEndgameKeys,
  objectiveEndgameSchema,
  objectiveInfoKeys,
  objectiveInfoSchema,
  objectiveOtherKeys,
  objectiveOtherSchema,
  objectivePostgameKeys,
  objectivePostgameSchema,
  objectivePregameKeys,
  objectivePregameSchema,
  objectiveTeleopKeys,
  objectiveTeleopSchema,
  pitAutoKeys,
  pitAutoSchema,
  pitDriveKeys,
  pitDriveSchema,
  pitEndgameKeys,
  pitEndgameSchema,
  pitInfoKeys,
  pitInfoSchema,
  pitOtherKeys,
  pitOtherSchema,
  pitSpecificationsKeys,
  pitSpecificationsSchema,
  pitTeleopKeys,
  pitTeleopSchema,
  subjectiveInfoKeys,
  subjectiveInfoSchema,
  subjectiveOtherKeys,
  subjectiveOtherSchema,
  subjectiveTeamKeys,
  subjectiveTeamSchema,
} from '~/models';
import {
  objectiveAutoAtom,
  objectiveEndgameAtom,
  objectiveInfoAtom,
  objectiveOtherAtom,
  objectivePostgameAtom,
  objectivePregameAtom,
  objectiveTeleopAtom,
  pitAutoAtom,
  pitDriveAtom,
  pitEndgameAtom,
  pitInfoAtom,
  pitOtherAtom,
  pitSpecificationsAtom,
  pitTeleopAtom,
  subjectiveInfoAtom,
  subjectiveOtherAtom,
  subjectiveTeamOneAtom,
  subjectiveTeamThreeAtom,
  subjectiveTeamTwoAtom,
} from '~/state';
import { RootStackParamList } from '~/types';

export const scoringCards: {
  factory: ReturnType<typeof scoringCardFactory>;
  name: keyof RootStackParamList;
}[] = [
  // Objective
  {
    name: 'ObjectiveInfo',
    factory: scoringCardFactory({
      atom: objectiveInfoAtom,
      keys: objectiveInfoKeys,
      zodSchema: objectiveInfoSchema,
      type: { name: 'objective' },
      nextPage: 'ObjectivePregame',
    }),
  },
  {
    name: 'ObjectivePregame',
    factory: scoringCardFactory({
      atom: objectivePregameAtom,
      keys: objectivePregameKeys,
      zodSchema: objectivePregameSchema,
      type: { name: 'objective' },
      nextPage: 'ObjectiveAuto',
    }),
  },
  {
    name: 'ObjectiveAuto',
    factory: scoringCardFactory({
      atom: objectiveAutoAtom,
      keys: objectiveAutoKeys,
      zodSchema: objectiveAutoSchema,
      type: { name: 'objective' },
      nextPage: 'ObjectiveTeleop',
    }),
  },
  {
    name: 'ObjectiveTeleop',
    factory: scoringCardFactory({
      atom: objectiveTeleopAtom,
      keys: objectiveTeleopKeys,
      zodSchema: objectiveTeleopSchema,
      type: { name: 'objective' },
      nextPage: 'ObjectiveEndgame',
    }),
  },
  {
    name: 'ObjectiveEndgame',
    factory: scoringCardFactory({
      atom: objectiveEndgameAtom,
      keys: objectiveEndgameKeys,
      zodSchema: objectiveEndgameSchema,
      type: { name: 'objective' },
      nextPage: 'ObjectivePostgame',
    }),
  },
  {
    name: 'ObjectivePostgame',
    factory: scoringCardFactory({
      atom: objectivePostgameAtom,
      keys: objectivePostgameKeys,
      zodSchema: objectivePostgameSchema,
      type: { name: 'objective' },
      nextPage: 'ObjectiveOther',
    }),
  },
  {
    name: 'ObjectiveOther',
    factory: scoringCardFactory({
      atom: objectiveOtherAtom,
      keys: objectiveOtherKeys,
      zodSchema: objectiveOtherSchema,
      type: { name: 'objective' },
      nextPage: 'QR',
    }),
  },
  // Subjective
  {
    name: 'SubjectiveInfo',
    factory: scoringCardFactory({
      atom: subjectiveInfoAtom,
      keys: subjectiveInfoKeys,
      zodSchema: subjectiveInfoSchema,
      type: { name: 'subjective', team: 'none' },
      nextPage: 'SubjectiveTeamOne',
    }),
  },
  {
    name: 'SubjectiveTeamOne',
    factory: scoringCardFactory({
      atom: subjectiveTeamOneAtom,
      keys: subjectiveTeamKeys,
      zodSchema: subjectiveTeamSchema,
      type: { name: 'subjective', team: 'one' },
      nextPage: 'SubjectiveTeamTwo',
    }),
  },
  {
    name: 'SubjectiveTeamTwo',
    factory: scoringCardFactory({
      atom: subjectiveTeamTwoAtom,
      keys: subjectiveTeamKeys,
      zodSchema: subjectiveTeamSchema,
      type: { name: 'subjective', team: 'two' },
      nextPage:
        game.allianceSize === 3 ? 'SubjectiveTeamThree' : 'SubjectiveOther',
    }),
  },
  ...(subjectiveTeamThreeAtom !== null
    ? [
        {
          name: 'SubjectiveTeamThree' as const,
          factory: scoringCardFactory({
            atom: subjectiveTeamThreeAtom,
            keys: subjectiveTeamKeys,
            zodSchema: subjectiveTeamSchema,
            type: { name: 'subjective', team: 'three' },
            nextPage: 'SubjectiveOther',
          }),
        },
      ]
    : []),
  {
    name: 'SubjectiveOther',
    factory: scoringCardFactory({
      atom: subjectiveOtherAtom,
      keys: subjectiveOtherKeys,
      zodSchema: subjectiveOtherSchema,
      type: { name: 'subjective', team: 'none' },
      nextPage: 'QR',
    }),
  },
  // Pit
  {
    name: 'PitInfo',
    factory: scoringCardFactory({
      atom: pitInfoAtom,
      keys: pitInfoKeys,
      zodSchema: pitInfoSchema,
      type: { name: 'pit' },
      nextPage: 'PitSpecifications',
    }),
  },
  {
    name: 'PitSpecifications',
    factory: scoringCardFactory({
      atom: pitSpecificationsAtom,
      keys: pitSpecificationsKeys,
      zodSchema: pitSpecificationsSchema,
      type: { name: 'pit' },
      nextPage: 'PitDrive',
    }),
  },
  {
    name: 'PitDrive',
    factory: scoringCardFactory({
      atom: pitDriveAtom,
      keys: pitDriveKeys,
      zodSchema: pitDriveSchema,
      type: { name: 'pit' },
      nextPage: 'PitAuto',
    }),
  },
  {
    name: 'PitAuto',
    factory: scoringCardFactory({
      atom: pitAutoAtom,
      keys: pitAutoKeys,
      zodSchema: pitAutoSchema,
      type: { name: 'pit' },
      nextPage: 'PitTeleop',
    }),
  },
  {
    name: 'PitTeleop',
    factory: scoringCardFactory({
      atom: pitTeleopAtom,
      keys: pitTeleopKeys,
      zodSchema: pitTeleopSchema,
      type: { name: 'pit' },
      nextPage: 'PitEndgame',
    }),
  },
  {
    name: 'PitEndgame',
    factory: scoringCardFactory({
      atom: pitEndgameAtom,
      keys: pitEndgameKeys,
      zodSchema: pitEndgameSchema,
      type: { name: 'pit' },
      nextPage: 'PitOther',
    }),
  },
  {
    name: 'PitOther',
    factory: scoringCardFactory({
      atom: pitOtherAtom,
      keys: pitOtherKeys,
      zodSchema: pitOtherSchema,
      type: { name: 'pit' },
      nextPage: 'QR',
    }),
  },
];
