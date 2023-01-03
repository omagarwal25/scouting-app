import { game } from "./game";
import {
  objectiveAutoKeys,
  objectiveEndgameKeys,
  objectiveInfoKeys,
  objectivePostgameKeys,
  objectivePregameKeys,
  ObjectiveRecord,
  objectiveTeleopKeys,
  pitAutoKeys,
  pitDriveKeys,
  pitEndgameKeys,
  pitInfoKeys,
  pitOtherKeys,
  PitRecord,
  pitSpecificationsKeys,
  pitTeleopKeys,
  subjectiveInfoKeys,
  subjectiveOtherKeys,
  SubjectiveRecord,
  subjectiveTeamKeys,
} from "./screens";

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

export const encodeObjectiveRecord = (record: ObjectiveRecord) => {
  const auto = encode(record.auto, objectiveAutoKeys);
  const endgame = encode(record.endgame, objectiveEndgameKeys);
  const postgame = encode(record.postgame, objectivePostgameKeys);
  const teleop = encode(record.teleop, objectiveTeleopKeys);
  const pregame = encode(record.pregame, objectivePregameKeys);
  const info = encode(record.info, objectiveInfoKeys);
  return `o!${auto}@${endgame}@${postgame}@${teleop}@${pregame}@${info}`;
};

export const encodeSubjectiveRecord = (record: SubjectiveRecord) => {
  const teamOne = encode(record.teamOne, subjectiveTeamKeys);
  const teamTwo = encode(record.teamTwo, subjectiveTeamKeys);
  const teamThree = encode(record.teamThree, subjectiveTeamKeys);
  const info = encode(record.info, subjectiveInfoKeys);
  const other = encode(record.other, subjectiveOtherKeys);

  return `s!${teamOne}@${teamTwo}@${teamThree}@${other}@${info}`;
};

export const encodePitRecord = (record: PitRecord) => {
  const auto = encode(record.auto, pitAutoKeys);
  const teleop = encode(record.teleop, pitTeleopKeys);
  const endgame = encode(record.endgame, pitEndgameKeys);
  const info = encode(record.info, pitInfoKeys);
  const other = encode(record.other, pitOtherKeys);
  const specifications = encode(record.specifications, pitSpecificationsKeys);
  const drive = encode(record.drive, pitDriveKeys);

  return `p!${auto}@${teleop}@${endgame}@${other}@${specifications}@${drive}@${info}`;
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
    info: decode(split[5], objectiveInfoKeys),
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
    auto: decode(split[0], pitAutoKeys),
    teleop: decode(split[1], pitTeleopKeys),
    endgame: decode(split[2], pitEndgameKeys),
    other: decode(split[3], pitOtherKeys),
    specifications: decode(split[4], pitSpecificationsKeys),
    drive: decode(split[5], pitDriveKeys),
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
