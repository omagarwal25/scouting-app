// encodes and decodes game state, using auto and other screens

import { gameDefault } from "./defaults";
import { game } from "./game";
import {
  autoKeys,
  endgameKeys,
  gameInfoKeys,
  postgameKeys,
  pregameKeys,
  teleopKeys,
  Game,
} from "./screens";

export const encode = <T extends string>(
  state: Record<T, string | number | boolean>,
  keys: readonly T[]
) => {
  return keys.reduce((acc, key) => {
    const scoringElement = game.scoringElements.find((se) => se.name === key);

    if (!scoringElement) return acc;

    if (scoringElement.field.fieldType === "Numeric")
      return acc + state[key].toString(36) + "$";
    else if (scoringElement.field.fieldType === "Dropdown")
      return (
        acc + scoringElement.field.options.indexOf(state[key] as string) + "$"
      );
    else if (scoringElement.field.fieldType === "Boolean")
      return acc + state[key] ? "1" : "0" + "$";
    else if (scoringElement.field.fieldType === "Text")
      return ((acc + state[key]) as string) + "$";
    else return acc + state[key] + "$";
  }, "");
};

export const decode = <T extends string>(
  str: string,
  state: Record<T, string | number | boolean>,
  keys: readonly T[]
) => {
  const split = str.split("$");

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const scoringElement = game.scoringElements.find((se) => se.name === key);

    if (!scoringElement) continue;

    if (scoringElement.field.fieldType === "Numeric") {
      state[key] = parseInt(split[i], 36);
    } else if (scoringElement.field.fieldType === "Dropdown") {
      state[key] = scoringElement.field.options[parseInt(split[i], 10)];
    } else if (scoringElement.field.fieldType === "Boolean") {
      state[key] = split[i] === "1";
    } else if (scoringElement.field.fieldType === "Text") {
      state[key] = split[i];
    } else {
      state[key] = split[i];
    }
  }

  return state;
};

export const encodeGame = (game: Game) => {
  const auto = encode(game.auto, autoKeys);
  const endgame = encode(game.endgame, endgameKeys);
  const postgame = encode(game.postgame, postgameKeys);
  const teleop = encode(game.teleop, teleopKeys);
  const pregame = encode(game.pregame, pregameKeys);
  const gameInfo = encodeGameInfo(game.gameInfo);
  return `${auto}@${endgame}@${postgame}@${teleop}@${pregame}@${gameInfo}`;
};

export const encodeGameInfo = (gameInfo: Game["gameInfo"]) => {
  gameInfoKeys;

  return `${gameInfo.scoutId}$${gameInfo.matchType}$${gameInfo.matchNumber}$${gameInfo.teamColor}$${gameInfo.teamNumber}`;
};

export const decodeGame = (str: string) => {
  const split = str.split("@");

  const game: Game = {
    ...gameDefault,
    gameInfo: {
      scoutId: "Red1",
      teamNumber: 0,
      matchNumber: 0,
      matchType: "qualifier",
      teamColor: "red",
    },
  };

  decode(split[0], game.auto, autoKeys);
  decode(split[1], game.endgame, endgameKeys);
  decode(split[2], game.postgame, postgameKeys);
  decode(split[3], game.teleop, teleopKeys);
  decode(split[4], game.pregame, pregameKeys);
  decode(split[5], game.gameInfo, gameInfoKeys);

  return game;
};
