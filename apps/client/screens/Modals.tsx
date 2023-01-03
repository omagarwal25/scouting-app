import { scoringCardFactory } from '~/components/input/ScoringCard';
import {
  objectiveAutoKeys,
  objectiveAutoSchema,
  objectiveEndgameKeys,
  objectiveEndgameSchema,
  objectiveInfoKeys,
  objectiveInfoSchema,
  objectivePostgameKeys,
  objectivePostgameSchema,
  objectivePregameKeys,
  objectivePregameSchema,
  objectiveTeleopKeys,
  objectiveTeleopSchema,
} from '~/models';
import {
  objectiveAutoAtom,
  objectiveEndgameAtom,
  objectiveInfoAtom,
  objectivePostgameAtom,
  objectivePregameAtom,
  objectiveTeleopAtom,
} from '~/state';
import { RootStackParamList } from '~/types';

export const scoringCards: {
  factory: ReturnType<typeof scoringCardFactory>;
  name: keyof RootStackParamList;
}[] = [
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
  
];
