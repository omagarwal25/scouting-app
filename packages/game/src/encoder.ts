// encodes and decodes game state, using auto and other screens

import { gameDefault } from "./defaults";
import { game } from "./game";
import {
  autoKeys,
  endgameKeys,
  postgameKeys,
  pregameKeys,
  teleopKeys,
  Game,
  infoKeys,
} from "./screens";

export const encode = <T extends string>(
  state: Record<T, number | string | boolean>,
  keys: readonly T[]
) => {
  return keys.reduce((acc, key) => {
    const scoringElement = game.scoringElements.find((se) => se.name === key);
    if (!scoringElement) return acc;

    if (scoringElement.field.fieldType === "Numeric")
      // return acc + state[key].toString(36) + "$";
      return acc + state[key].toString() + "$";
    else if (scoringElement.field.fieldType === "Dropdown")
      return (
        acc +
        scoringElement.field.options.indexOf(state[key] as string).toString() +
        "$"
      );
    else if (scoringElement.field.fieldType === "Boolean")
      return acc + (state[key] ? "1" : "0") + "$";
    else if (scoringElement.field.fieldType === "Text")
      return ((acc + state[key]) as string) + "$";
    else return acc + state[key] + "$";
  }, "");
};

export const decode = <B extends { [key: string]: string | number | boolean }>(
  str: string,
  keys: readonly (keyof B)[]
) => {
  const state: B = {} as B;
  const split = str.split("$");

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const scoringElement = game.scoringElements.find((se) => se.name === key);

    if (!scoringElement) continue;

    if (scoringElement.field.fieldType === "Numeric") {
      // state[key] = parseInt(split[i], 36) as B[typeof key];
      state[key] = split[i] as B[typeof key];
    } else if (scoringElement.field.fieldType === "Dropdown") {
      state[key] = scoringElement.field.options[
        parseInt(split[i], 10)
      ] as B[typeof key];
    } else if (scoringElement.field.fieldType === "Boolean") {
      state[key] = (split[i] === "1") as B[typeof key];
    } else if (scoringElement.field.fieldType === "Text") {
      state[key] = split[i] as B[typeof key];
    } else {
      state[key] = split[i] as B[typeof key];
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
  const info = encode(game.info, infoKeys);
  return `${auto}@${endgame}@${postgame}@${teleop}@${pregame}@${info}`;
};

export const decodeGame = (str: string): Game => {
  const split = str.split("@");
  const game: Game = {
    auto: decode(split[0], autoKeys),
    endgame: decode(split[1], endgameKeys),
    postgame: decode(split[2], postgameKeys),
    teleop: decode(split[3], teleopKeys),
    pregame: decode(split[4], pregameKeys),
    info: decode(split[5], infoKeys),
  };

  return game;
};
