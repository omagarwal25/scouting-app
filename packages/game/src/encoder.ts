// encodes and decodes game state, using auto and other screens
// fun compression algorithm
// TODO when we add subjective scouting in the future we should use a prefix to indicate that, maybe s and r

import { game } from "./game";
import {
  AllianceSubjective,
  autoKeys,
  endgameKeys,
  Game,
  infoKeys,
  postgameKeys,
  pregameKeys,
  subjectiveKeys,
  subjInfoKeys,
  teleopKeys,
} from "./screens";

/**
 * Encodes a game state into a string.
 * @param state current game state
 * @param keys keys to encode
 * @returns string encoded state
 */
export const encode = <T extends string>(
  state: Record<T, number | string | boolean>,
  keys: readonly T[]
) => {
  return keys.reduce((acc, key) => {
    const element =
      game.objectiveElements.find((se) => se.name === key) ??
      game.subjectiveElements.find((se) => se.name === key);

    if (!element) return acc;

    if (element.field.fieldType === "Numeric")
      return acc + state[key].toString(16) + "$";
    // return acc + state[key].toString() + "$";
    else if (element.field.fieldType === "Dropdown")
      return (
        acc +
        element.field.options.indexOf(state[key] as string).toString() +
        "$"
      );
    else if (element.field.fieldType === "Boolean")
      return acc + (state[key] ? "1" : "0") + "$";
    else if (element.field.fieldType === "Text")
      return ((acc + state[key]) as string) + "$";
    else return acc + state[key] + "$";
  }, "");
};

/**
 * Decodes a string into a game state. Pass a generic that specifies the shape of the state.
 * @param str string to decode
 * @param keys keys that are needed in the correct order
 * @returns decoded state
 */
export const decode = <B extends { [key: string]: string | number | boolean }>(
  str: string,
  keys: readonly (keyof B)[]
) => {
  const state: B = {} as B;
  const split = str.split("$");

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const objectiveElement = game.objectiveElements.find(
      (se) => se.name === key
    );

    if (!objectiveElement) continue;

    if (objectiveElement.field.fieldType === "Numeric") {
      state[key] = parseInt(split[i], 16) as B[typeof key];
      // state[key] = split[i] as B[typeof key];
    } else if (objectiveElement.field.fieldType === "Dropdown") {
      state[key] = objectiveElement.field.options[
        parseInt(split[i], 10)
      ] as B[typeof key];
    } else if (objectiveElement.field.fieldType === "Boolean") {
      state[key] = (split[i] === "1") as B[typeof key];
    } else if (objectiveElement.field.fieldType === "Text") {
      state[key] = split[i] as B[typeof key];
    } else {
      state[key] = split[i] as B[typeof key];
    }
  }

  return state;
};

/**
 * Encodes a game state into a string
 * @param game the game to encode
 * @returns encoded game using @ and $ as separators, ! as a prefix for objective
 */
export const encodeGame = (game: Game) => {
  const auto = encode(game.auto, autoKeys);
  const endgame = encode(game.endgame, endgameKeys);
  const postgame = encode(game.postgame, postgameKeys);
  const teleop = encode(game.teleop, teleopKeys);
  const pregame = encode(game.pregame, pregameKeys);
  const info = encode(game.info, infoKeys);
  return `!${auto}@${endgame}@${postgame}@${teleop}@${pregame}@${info}`;
};

/**
 * Encodes a subjective state into a string
 */
export const encodeSubjective = (subjective: AllianceSubjective) => {
  const teamOne = encode(subjective.teamOne, subjectiveKeys);
  const teamTwo = encode(subjective.teamTwo, subjectiveKeys);
  const teamThree = encode(subjective.teamThree, subjectiveKeys);
  const info = encode(subjective.info, subjInfoKeys);

  return `?${teamOne}@${teamTwo}@${teamThree}@${info}`;
};

/**
 * Decodes a string @ and $ separated string into a game object.
 * @param str - string to decode
 * @returns a fully decoded game
 */
export const decodeGame = (str: string): Game => {
  // remove the ! prefix
  const split = str.slice(1).split("@");
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

/**
 * Decodes a string @ and $ separated string into a subjective object.
 * @param str - string to decode
 * @returns a fully decoded subjective
 * @see decode
 * @see encodeSubjective
 */
export const decodeSubjective = (str: string): AllianceSubjective => {
  // remove the ? prefix
  const split = str.slice(1).split("@");
  const subjective: AllianceSubjective = {
    teamOne: decode(split[0], subjectiveKeys),
    teamTwo: decode(split[1], subjectiveKeys),
    teamThree: decode(split[2], subjectiveKeys),
    info: decode(split[3], subjInfoKeys),
  };

  return subjective;
};

export const getEncodedType = (str: string): "objective" | "subjective" => {
  if (str.startsWith("!")) return "objective";
  if (str.startsWith("?")) return "subjective";
  return "objective";
};
