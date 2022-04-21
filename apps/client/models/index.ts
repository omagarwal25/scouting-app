import {
  autoSchema,
  z,
  teleopSchema,
  pregameSchema,
  endgameSchema,
  postgameSchema,
} from 'scouting-app-game';
import { gameInfoSchema } from './gameInfo';

export const gameSchema = z.object({
  gameInfo: gameInfoSchema,
  pregame: pregameSchema,
  auto: autoSchema,
  teleop: teleopSchema,
  endgame: endgameSchema,
  postgame: postgameSchema,
});

export type Game = z.infer<typeof gameSchema>;
export * from './gameInfo';
export * from 'scouting-app-game';
