import { scoringCardFactory } from '~/components/input/ScoringCard';
import {
  autoKeys,
  autoSchema,
  endgameKeys,
  endgameSchema,
  infoKeys,
  infoSchema,
  postgameKeys,
  postgameSchema,
  pregameKeys,
  pregameSchema,
  subjectiveKeys,
  subjectiveSchema,
  subjInfoKeys,
  subjInfoSchema,
  teleopKeys,
  teleopSchema,
} from '~/models';
import {
  autoAtom,
  endgameAtom,
  infoAtom,
  postgameAtom,
  pregameAtom,
  subjInfoAtom,
  subjTeamOneAtom,
  subjTeamThreeAtom,
  subjTeamTwoAtom,
  teleopAtom,
} from '~/state';
import { RootStackParamList } from '~/types';

export const scoringCards: {
  factory: ReturnType<typeof scoringCardFactory>;
  name: keyof RootStackParamList;
}[] = [
  {
    name: 'Info',
    factory: scoringCardFactory({
      atom: infoAtom,
      keys: infoKeys,
      type: { name: 'info' },
      nextPage: 'Pregame',
      zodSchema: infoSchema,
    }),
  },
  {
    name: 'Pregame',
    factory: scoringCardFactory({
      atom: pregameAtom,
      type: { name: 'objective' },
      keys: pregameKeys,
      nextPage: 'Auto',
      zodSchema: pregameSchema,
    }),
  },
  {
    name: 'Auto',
    factory: scoringCardFactory({
      atom: autoAtom,
      type: { name: 'objective' },
      keys: autoKeys,
      nextPage: 'Teleop',
      zodSchema: autoSchema,
    }),
  },
  {
    name: 'Teleop',
    factory: scoringCardFactory({
      atom: teleopAtom,
      type: { name: 'objective' },
      keys: teleopKeys,
      nextPage: 'Endgame',
      zodSchema: teleopSchema,
    }),
  },
  {
    name: 'Endgame',
    factory: scoringCardFactory({
      atom: endgameAtom,
      type: { name: 'objective' },
      keys: endgameKeys,
      nextPage: 'Postgame',
      zodSchema: endgameSchema,
    }),
  },
  {
    name: 'Postgame',
    factory: scoringCardFactory({
      atom: postgameAtom,
      type: { name: 'objective' },
      keys: postgameKeys,
      nextPage: 'QR',
      zodSchema: postgameSchema,
    }),
  },
  {
    name: 'Subjective Info',
    factory: scoringCardFactory({
      atom: subjInfoAtom,
      type: { name: 'info' },
      keys: subjInfoKeys,
      nextPage: 'Subjective Team One',
      zodSchema: subjInfoSchema,
    }),
  },
  {
    name: 'Subjective Team One',
    factory: scoringCardFactory({
      atom: subjTeamOneAtom,
      type: { name: 'subjective', team: 'one' },
      keys: subjectiveKeys,
      nextPage: 'Subjective Team Two',
      zodSchema: subjectiveSchema,
    }),
  },
  {
    name: 'Subjective Team Two',
    factory: scoringCardFactory({
      atom: subjTeamTwoAtom,
      type: { name: 'subjective', team: 'two' },
      keys: subjectiveKeys,
      nextPage: 'Subjective Team Three',
      zodSchema: subjectiveSchema,
    }),
  },
  {
    name: 'Subjective Team Three',
    factory: scoringCardFactory({
      atom: subjTeamThreeAtom,
      type: { name: 'subjective', team: 'three' },
      keys: subjectiveKeys,
      nextPage: 'QR',
      zodSchema: subjectiveSchema,
    }),
  },
];
