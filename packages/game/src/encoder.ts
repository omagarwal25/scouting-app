import { z } from "zod";
import { game } from "./game";
import {
  objectiveAutoKeys,
  objectiveEndgameKeys,
  ObjectiveInfo,
  objectiveInfoKeys,
  objectiveOtherKeys,
  objectivePostgameKeys,
  objectivePregameKeys,
  ObjectiveRecord,
  objectiveRecordSchema,
  objectiveTeleopKeys,
  pitAutoKeys,
  pitDriveKeys,
  pitEndgameKeys,
  PitInfo,
  pitInfoKeys,
  pitOtherKeys,
  PitRecord,
  pitRecordSchema,
  pitSpecificationsKeys,
  pitTeleopKeys,
} from "./screens";
import { ScoutingElement, Screen } from "./types";

export const recordSchema = z
  .object({
    type: z.literal("objective"),
    record: objectiveRecordSchema,
  })
  .or(
    z.object({
      type: z.literal("pit"),
      record: pitRecordSchema,
    })
  );

export type GameRecord = z.infer<typeof recordSchema>;

// encodes and decodes game state, using auto and other screens
// fun compression algorithm

/**
 * Encodes a game state into a string.
 * @param state current game state
 * @param keys keys to encode
 * @returns string encoded state
 */
export const encode = <T extends string>(
  state: Record<
    T,
    number | string | boolean | Record<string, number | string | boolean>[]
  >,
  keys: readonly T[],
  screen: Screen
) => {
  return keys.reduce((acc, key) => {
    const elements: ScoutingElement[] = game["elements"];
    const element = elements.find(
      (se) => se.name === key && se.screens.includes(screen)
    );
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
    else
      return (
        acc +
        (state[key] as Record<string, string | number | boolean>[])
          .map((i) => encodeCycle(i, screen, element))
          .join("/") +
        "$"
      );
  }, "");
};

const encodeCycle = (
  state: Record<string, number | string | boolean>,
  screen: Screen,
  grouping: ScoutingElement
) => {
  return Object.keys(state).reduce((acc, key) => {
    if (grouping.field.fieldType !== "Grouping") return acc;
    const elements: ScoutingElement[] = grouping.field.fields;
    const element = elements.find(
      (se) => se.name === key && se.screens.includes(screen)
    );

    if (!element) return acc;

    if (element.field.fieldType === "Numeric")
      return acc + state[key].toString(16) + "|";
    else if (element.field.fieldType === "Dropdown")
      return (
        acc +
        element.field.options.indexOf(state[key] as string).toString() +
        "|"
      );
    else if (element.field.fieldType === "Boolean")
      return acc + (state[key] ? "1" : "0") + "|";
    else if (element.field.fieldType === "Text")
      return ((acc + state[key]) as string) + "|";
    else return acc + state[key] + "|";
  }, "");
};

/**
 * Decodes a string into a game state. Pass a generic that specifies the shape of the state.
 * @param str string to decode
 * @param keys keys that are needed in the correct order
 * @returns decoded state
 */
export const decode = <
  B extends {
    [key: string]:
      | string
      | number
      | boolean
      | Record<string, string | number | boolean>[];
  }
>(
  str: string,
  keys: readonly (keyof B)[],
  screen: Screen
) => {
  const state: B = {} as B;
  const split = str.split("$");

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const elements: ScoutingElement[] = game["elements"];
    const element = elements.find(
      (se) => se.name === key && se.screens.includes(screen)
    );

    if (!element) continue;

    if (element.field.fieldType === "Numeric") {
      state[key] = parseInt(split[i], 16) as B[typeof key];
      // state[key] = split[i] as B[typeof key];
    } else if (element.field.fieldType === "Dropdown") {
      state[key] = element.field.options[
        parseInt(split[i], 10)
      ] as B[typeof key];
    } else if (element.field.fieldType === "Boolean") {
      state[key] = (split[i] === "1") as B[typeof key];
    } else if (element.field.fieldType === "Text") {
      state[key] = split[i] as B[typeof key];
    } else {
      const groupSplit = split[i].split("/");
      if (groupSplit[0] === "") state[key] = [] as unknown as B[typeof key];
      else
        state[key] = groupSplit.map((s) =>
          decodeCycle(s, screen, element)
        ) as unknown as B[typeof key];
    }
  }

  return state;
};

const decodeCycle = (
  str: string,
  screen: Screen,
  grouping: ScoutingElement
): Record<string, string | number | boolean> => {
  const state: Record<string, string | number | boolean> = {};
  const split = str.split("|");

  if (grouping.field.fieldType !== "Grouping") return state;
  const elements: ScoutingElement[] = grouping.field.fields;
  if (grouping.field.fieldType !== "Grouping") return state;

  const keys = grouping.field.fields.map((g) => g.name);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const element = elements.find(
      (se) => se.name === key && se.screens.includes(screen)
    );
    if (!element) continue;

    if (element.field.fieldType === "Numeric") {
      state[key] = parseInt(split[i], 16);
    } else if (element.field.fieldType === "Dropdown") {
      state[key] = element.field.options[parseInt(split[i], 10)];
    } else if (element.field.fieldType === "Boolean") {
      state[key] = split[i] === "1";
    } else if (element.field.fieldType === "Text") {
      state[key] = split[i];
    } else {
      state[key] = split[i];
    }
  }

  return state;
};

export const encodeObjectiveRecord = (record: ObjectiveRecord) => {
  const auto = encode(record.auto, objectiveAutoKeys, "ObjectiveAuto");
  const endgame = encode(
    record.endgame,
    objectiveEndgameKeys,
    "ObjectiveEndgame"
  );
  const postgame = encode(
    record.postgame,
    objectivePostgameKeys,
    "ObjectivePostgame"
  );
  const teleop = encode(record.teleop, objectiveTeleopKeys, "ObjectiveTeleop");
  const pregame = encode(
    record.pregame,
    objectivePregameKeys,
    "ObjectivePregame"
  );
  const info = encode(record.info, objectiveInfoKeys, "ObjectiveInfo");
  const other = encode(record.other, objectiveOtherKeys, "ObjectiveOther");

  return `o!${auto}@${endgame}@${postgame}@${teleop}@${pregame}@${other}@${info}`;
};

export const encodePitRecord = (record: PitRecord) => {
  const auto = encode(record.auto, pitAutoKeys, "PitAuto");
  const teleop = encode(record.teleop, pitTeleopKeys, "PitTeleop");
  const endgame = encode(record.endgame, pitEndgameKeys, "PitEndgame");
  const info = encode(record.info, pitInfoKeys, "PitInfo");
  const other = encode(record.other, pitOtherKeys, "PitOther");
  const specifications = encode(
    record.specifications,
    pitSpecificationsKeys,
    "PitSpecifications"
  );
  const drive = encode(record.drive, pitDriveKeys, "PitDrive");

  return `p!${specifications}@${drive}@${auto}@${teleop}@${endgame}@${other}@${info}`;
};

export const decodeObjectiveRecord = (str: string): ObjectiveRecord => {
  // remove the o! prefix
  const split = str.slice(2).split("@");

  const record: ObjectiveRecord = {
    auto: decode(split[0], objectiveAutoKeys, "ObjectiveAuto"),
    endgame: decode(split[1], objectiveEndgameKeys, "ObjectiveEndgame"),
    postgame: decode(split[2], objectivePostgameKeys, "ObjectivePostgame"),
    teleop: decode(split[3], objectiveTeleopKeys, "ObjectiveTeleop"),
    pregame: decode(split[4], objectivePregameKeys, "ObjectivePregame"),
    other: decode(split[5], objectiveOtherKeys, "ObjectiveOther"),
    info: decode(split[6], objectiveInfoKeys, "ObjectiveInfo"),
  };

  return record;
};

export const decodePitRecord = (str: string): PitRecord => {
  // remove the p! prefix

  const split = str.slice(2).split("@");

  const record: PitRecord = {
    specifications: decode(
      split[0],
      pitSpecificationsKeys,
      "PitSpecifications"
    ),
    drive: decode(split[1], pitDriveKeys, "PitDrive"),
    auto: decode(split[2], pitAutoKeys, "PitAuto"),
    teleop: decode(split[3], pitTeleopKeys, "PitTeleop"),
    endgame: decode(split[4], pitEndgameKeys, "PitEndgame"),
    other: decode(split[5], pitOtherKeys, "PitOther"),
    info: decode(split[6], pitInfoKeys, "PitInfo"),
  };

  return record;
};

export const getEncodedType = (str: string): "objective" | "pit" => {
  if (str.startsWith("o!")) return "objective";
  else if (str.startsWith("p!")) return "pit";
  else throw new Error("Invalid encoded string");
};

export const decodeRecord = (str: string): GameRecord => {
  const type = getEncodedType(str);
  if (type === "objective") return { type, record: decodeObjectiveRecord(str) };
  return { type, record: decodePitRecord(str) };
};

export const encodeObjectiveInfo = (info: ObjectiveInfo) => {
  const coded = encode(info, objectiveInfoKeys, "ObjectiveInfo");
  return `o!${coded}`;
};

export const encodePitInfo = (info: PitInfo) => {
  const coded = encode(info, pitInfoKeys, "PitInfo");
  return `p!${coded}`;
};

export const decodeObjectiveInfo = (str: string): ObjectiveInfo => {
  const split = str.slice(2);
  return decode(split, objectiveInfoKeys, "ObjectiveInfo");
};

export const decodePitInfo = (str: string): PitInfo => {
  const split = str.slice(2);
  return decode(split, pitInfoKeys, "PitInfo");
};

export const decodeInfo = (
  str: string
):
  | { type: "objective"; info: ObjectiveInfo }
  | { type: "pit"; info: PitInfo } => {
  const type = getEncodedType(str);
  if (type === "objective") return { type, info: decodeObjectiveInfo(str) };
  return { type, info: decodePitInfo(str) };
};
