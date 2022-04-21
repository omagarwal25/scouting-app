import {
  autoKeys,
  endgameKeys,
  Game,
  gameInfoKeys,
  postgameKeys,
  pregameKeys,
  teleopKeys,
} from '../models';

export const encode = (game: Game) => {
  const gameInfo = encodeElement(game.gameInfo, gameInfoKeys);
  const pregame = encodeElement(game.pregame, pregameKeys);
  const auto = encodeElement(game.auto, autoKeys);
  const teleop = encodeElement(game.teleop, teleopKeys);
  const endgame = encodeElement(game.endgame, endgameKeys);
  const postgame = encodeElement(game.postgame, postgameKeys);

  return JSON.stringify([
    ...gameInfo,
    ...pregame,
    ...auto,
    ...teleop,
    ...endgame,
    ...postgame,
  ]);
};

export const encodeElement = <T>(element: T, keys: readonly (keyof T)[]) =>
  keys.map((key) => element[key]);
