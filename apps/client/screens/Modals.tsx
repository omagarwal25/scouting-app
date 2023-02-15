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

export const scoringCards: ReturnType<typeof scoringCardFactory>[] = [
  // Objective
  scoringCardFactory({
    currentPage: 'ObjectiveInfo',
    screen: 'ObjectiveInfo',
    atom: objectiveInfoAtom,
    keys: objectiveInfoKeys,
    zodSchema: objectiveInfoSchema,
    type: { name: 'objective' },
    nextPage: 'ObjectivePregame',
  }),

  scoringCardFactory({
    currentPage: 'ObjectivePregame',
    screen: 'ObjectivePregame',
    atom: objectivePregameAtom,
    keys: objectivePregameKeys,
    zodSchema: objectivePregameSchema,
    type: { name: 'objective' },
    nextPage: 'ObjectiveAuto',
  }),

  scoringCardFactory({
    currentPage: 'ObjectiveAuto',
    screen: 'ObjectiveAuto',
    atom: objectiveAutoAtom,
    keys: objectiveAutoKeys,
    zodSchema: objectiveAutoSchema,
    type: { name: 'objective' },
    nextPage: 'ObjectiveTeleop',
  }),

  scoringCardFactory({
    currentPage: 'ObjectiveTeleop',
    screen: 'ObjectiveTeleop',
    atom: objectiveTeleopAtom,
    keys: objectiveTeleopKeys,
    zodSchema: objectiveTeleopSchema,
    type: { name: 'objective' },
    nextPage: 'ObjectiveEndgame',
  }),

  scoringCardFactory({
    currentPage: 'ObjectiveEndgame',
    screen: 'ObjectiveEndgame',
    atom: objectiveEndgameAtom,
    keys: objectiveEndgameKeys,
    zodSchema: objectiveEndgameSchema,
    type: { name: 'objective' },
    nextPage: 'ObjectivePostgame',
  }),

  scoringCardFactory({
    currentPage: 'ObjectivePostgame',
    screen: 'ObjectivePostgame',
    atom: objectivePostgameAtom,
    keys: objectivePostgameKeys,
    zodSchema: objectivePostgameSchema,
    type: { name: 'objective' },
    nextPage: 'ObjectiveOther',
  }),

  scoringCardFactory({
    currentPage: 'ObjectiveOther',
    screen: 'ObjectiveOther',
    atom: objectiveOtherAtom,
    keys: objectiveOtherKeys,
    zodSchema: objectiveOtherSchema,
    type: { name: 'objective' },
    nextPage: 'QR',
  }),

  // Subjective

  scoringCardFactory({
    currentPage: 'SubjectiveInfo',
    screen: 'SubjectiveInfo',
    atom: subjectiveInfoAtom,
    keys: subjectiveInfoKeys,
    zodSchema: subjectiveInfoSchema,
    type: { name: 'subjective', team: 'none' },
    nextPage: 'SubjectiveTeamOne',
  }),

  scoringCardFactory({
    currentPage: 'SubjectiveTeamOne',
    screen: 'SubjectiveTeam',
    atom: subjectiveTeamOneAtom,
    keys: subjectiveTeamKeys,
    zodSchema: subjectiveTeamSchema,
    type: { name: 'subjective', team: 'one' },
    nextPage: 'SubjectiveTeamTwo',
  }),

  scoringCardFactory({
    currentPage: 'SubjectiveTeamTwo',
    screen: 'SubjectiveTeam',
    atom: subjectiveTeamTwoAtom,
    keys: subjectiveTeamKeys,
    zodSchema: subjectiveTeamSchema,
    type: { name: 'subjective', team: 'two' },
    nextPage:
      game.allianceSize === 3 ? 'SubjectiveTeamThree' : 'SubjectiveOther',
  }),

  ...(subjectiveTeamThreeAtom !== null
    ? [
        scoringCardFactory({
          currentPage: 'SubjectiveTeamThree',
          screen: 'SubjectiveTeam',
          atom: subjectiveTeamThreeAtom,
          keys: subjectiveTeamKeys,
          zodSchema: subjectiveTeamSchema,
          type: { name: 'subjective', team: 'three' },
          nextPage: 'SubjectiveOther',
        }),
      ]
    : []),

  scoringCardFactory({
    currentPage: 'SubjectiveOther',
    screen: 'SubjectiveOther',
    atom: subjectiveOtherAtom,
    keys: subjectiveOtherKeys,
    zodSchema: subjectiveOtherSchema,
    type: { name: 'subjective', team: 'none' },
    nextPage: 'QR',
  }),

  // Pit

  scoringCardFactory({
    currentPage: 'PitInfo',
    screen: 'PitInfo',
    atom: pitInfoAtom,
    keys: pitInfoKeys,
    zodSchema: pitInfoSchema,
    type: { name: 'pit' },
    nextPage: 'PitSpecifications',
  }),

  scoringCardFactory({
    currentPage: 'PitSpecifications',
    screen: 'PitSpecifications',
    atom: pitSpecificationsAtom,
    keys: pitSpecificationsKeys,
    zodSchema: pitSpecificationsSchema,
    type: { name: 'pit' },
    nextPage: 'PitDrive',
  }),

  scoringCardFactory({
    currentPage: 'PitDrive',
    screen: 'PitDrive',
    atom: pitDriveAtom,
    keys: pitDriveKeys,
    zodSchema: pitDriveSchema,
    type: { name: 'pit' },
    nextPage: 'PitAuto',
  }),

  scoringCardFactory({
    currentPage: 'PitAuto',
    screen: 'PitAuto',
    atom: pitAutoAtom,
    keys: pitAutoKeys,
    zodSchema: pitAutoSchema,
    type: { name: 'pit' },
    nextPage: 'PitTeleop',
  }),

  scoringCardFactory({
    currentPage: 'PitTeleop',
    screen: 'PitTeleop',
    atom: pitTeleopAtom,
    keys: pitTeleopKeys,
    zodSchema: pitTeleopSchema,
    type: { name: 'pit' },
    nextPage: 'PitEndgame',
  }),

  scoringCardFactory({
    currentPage: 'PitEndgame',
    screen: 'PitEndgame',
    atom: pitEndgameAtom,
    keys: pitEndgameKeys,
    zodSchema: pitEndgameSchema,
    type: { name: 'pit' },
    nextPage: 'PitOther',
  }),

  scoringCardFactory({
    currentPage: 'PitOther',
    screen: 'PitOther',
    atom: pitOtherAtom,
    keys: pitOtherKeys,
    zodSchema: pitOtherSchema,
    type: { name: 'pit' },
    nextPage: 'QR',
  }),
];
