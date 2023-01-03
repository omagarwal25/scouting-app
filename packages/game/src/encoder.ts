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
  objectiveTeleopKeys,
  pitAutoKeys,
  pitDriveKeys,
  pitEndgameKeys,
  PitInfo,
  pitInfoKeys,
  pitOtherKeys,
  PitRecord,
  pitSpecificationsKeys,
  pitTeleopKeys,
  SubjectiveInfo,
  subjectiveInfoKeys,
  subjectiveOtherKeys,
  SubjectiveRecord,
  subjectiveTeamKeys,
} from "./screens";
import { ScoutingElement } from "./types";

// encodes and decodes game state, using auto and other screens
// fun compression algorithm
// TODO when we add subjective scouting in the future we should use a prefix to indicate that, maybe s and r

/**
 * Encodes a game state into a string.
 * @param state current game state
 * @param keys keys to encode
 * @returns string encoded state
 */
export const encode = <T extends string>(
  state: Record<T, number | string | boolean>,
  keys: readonly T[],
  type: "subjective" | "objective" | "pit"
) => {
  return keys.reduce((acc, key) => {
    const elements: ScoutingElement[] = game[`${type}Elements`];
    const element = elements.find((se) => se.name === key);

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

export const encodeObjectiveRecord = (record: ObjectiveRecord) => {
  const auto = encode(record.auto, objectiveAutoKeys, "objective");
  const endgame = encode(record.endgame, objectiveEndgameKeys, "objective");
  const postgame = encode(record.postgame, objectivePostgameKeys, "objective");
  const teleop = encode(record.teleop, objectiveTeleopKeys, "objective");
  const pregame = encode(record.pregame, objectivePregameKeys, "objective");
  const info = encode(record.info, objectiveInfoKeys, "objective");
  const other = encode(record.other, objectiveOtherKeys, "objective");

  return `o!${auto}@${endgame}@${postgame}@${teleop}@${pregame}@${other}@${info}`;
};

export const encodeSubjectiveRecord = (record: SubjectiveRecord) => {
  const teamOne = encode(record.teamOne, subjectiveTeamKeys, "subjective");
  const teamTwo = encode(record.teamTwo, subjectiveTeamKeys, "subjective");
  const teamThree = encode(record.teamThree, subjectiveTeamKeys, "subjective");
  const info = encode(record.info, subjectiveInfoKeys, "subjective");
  const other = encode(record.other, subjectiveOtherKeys, "subjective");

  return `s!${teamOne}@${teamTwo}@${teamThree}@${other}@${info}`;
};

export const encodePitRecord = (record: PitRecord) => {
  const auto = encode(record.auto, pitAutoKeys, "pit");
  const teleop = encode(record.teleop, pitTeleopKeys, "pit");
  const endgame = encode(record.endgame, pitEndgameKeys, "pit");
  const info = encode(record.info, pitInfoKeys, "pit");
  const other = encode(record.other, pitOtherKeys, "pit");
  const specifications = encode(
    record.specifications,
    pitSpecificationsKeys,
    "pit"
  );
  const drive = encode(record.drive, pitDriveKeys, "pit");

  return `p!${specifications}@${drive}@${auto}@${teleop}@${endgame}@${other}@${info}`;
};

export const decodeObjectiveRecord = (str: string): ObjectiveRecord => {
  // remove the o! prefix
  const split = str.slice(2).split("@");

  const record: ObjectiveRecord = {
    auto: decode(split[0], objectiveAutoKeys),
    endgame: decode(split[1], objectiveEndgameKeys),
    postgame: decode(split[2], objectivePostgameKeys),
    teleop: decode(split[3], objectiveTeleopKeys),
    pregame: decode(split[4], objectivePregameKeys),
    other: decode(split[5], objectiveOtherKeys),
    info: decode(split[6], objectiveInfoKeys),
  };

  return record;
};

export const decodeSubjectiveRecord = (str: string): SubjectiveRecord => {
  // remove the s! prefix
  const split = str.slice(2).split("@");

  const record: SubjectiveRecord = {
    teamOne: decode(split[0], subjectiveTeamKeys),
    teamTwo: decode(split[1], subjectiveTeamKeys),
    teamThree: decode(split[2], subjectiveTeamKeys),
    other: decode(split[3], subjectiveOtherKeys),
    info: decode(split[4], subjectiveInfoKeys),
  };

  return record;
};

export const decodePitRecord = (str: string): PitRecord => {
  // remove the p! prefix

  const split = str.slice(2).split("@");

  const record: PitRecord = {
    specifications: decode(split[0], pitSpecificationsKeys),
    drive: decode(split[1], pitDriveKeys),
    auto: decode(split[2], pitAutoKeys),
    teleop: decode(split[3], pitTeleopKeys),
    endgame: decode(split[4], pitEndgameKeys),
    other: decode(split[5], pitOtherKeys),
    info: decode(split[6], pitInfoKeys),
  };

  return record;
};

export const getEncodedType = (
  str: string
): "objective" | "subjective" | "pit" => {
  if (str.startsWith("o!")) return "objective";
  else if (str.startsWith("s!")) return "subjective";
  else if (str.startsWith("p!")) return "pit";
  else throw new Error("Invalid encoded string");
};

export const decodeRecord = (
  str: string
):
  | { type: "subjective"; record: SubjectiveRecord }
  | { type: "objective"; record: ObjectiveRecord }
  | { type: "pit"; record: PitRecord } => {
  const type = getEncodedType(str);
  if (type === "objective") return { type, record: decodeObjectiveRecord(str) };
  if (type === "subjective")
    return { type, record: decodeSubjectiveRecord(str) };
  return { type, record: decodePitRecord(str) };
};

export const encodeObjectiveInfo = (info: ObjectiveInfo) => {
  const coded = encode(info, objectiveInfoKeys, "objective");
  return `o!${coded}`;
};

export const encodeSubjectiveInfo = (info: SubjectiveInfo) => {
  const coded = encode(info, subjectiveInfoKeys, "subjective");
  return `s!${coded}`;
};

export const encodePitInfo = (info: PitInfo) => {
  const coded = encode(info, pitInfoKeys, "pit");
  return `p!${coded}`;
};

export const decodeObjectiveInfo = (str: string): ObjectiveInfo => {
  const split = str.slice(2).split("@");
  return decode(split[0], objectiveInfoKeys);
};

export const decodeSubjectiveInfo = (str: string): SubjectiveInfo => {
  const split = str.slice(2).split("@");
  return decode(split[0], subjectiveInfoKeys);
};

export const decodePitInfo = (str: string): PitInfo => {
  const split = str.slice(2).split("@");
  return decode(split[0], pitInfoKeys);
};

export const decodeInfo = (
  str: string
):
  | { type: "subjective"; info: SubjectiveInfo }
  | { type: "objective"; info: ObjectiveInfo }
  | { type: "pit"; info: PitInfo } => {
  const type = getEncodedType(str);
  if (type === "objective") return { type, info: decodeObjectiveInfo(str) };
  if (type === "subjective") return { type, info: decodeSubjectiveInfo(str) };
  return { type, info: decodePitInfo(str) };
};
