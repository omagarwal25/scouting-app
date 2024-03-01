import { objectiveRecordDefault, pitRecordDefault } from "./defaults";
import { game } from "./game";
import {
  ObjectiveRecord,
  PitRecord,
  objectiveAutoKeys,
  objectiveEndgameKeys,
  objectiveInfoKeys,
  objectiveOtherKeys,
  objectivePostgameKeys,
  objectivePregameKeys,
  objectiveTeleopKeys,
  pitAutoKeys,
  pitDriveKeys,
  pitEndgameKeys,
  pitInfoKeys,
  pitOtherKeys,
  pitSpecificationsKeys,
  pitTeleopKeys,
} from "./screens";

function elementToCell<T extends Record<string, any>, K extends keyof T>(
  key: string,
  screen: K,
  record: T,
  header = false
): string[] {
  const value: any =
    record[screen as keyof typeof record][
      key as keyof (typeof record)[typeof screen]
    ];

  if (typeof value === "object") {
    const map: Record<string, string> = {};

    const element = game.elements.find((e) => e.name === key)!!.field;
    if (element.fieldType !== "Grouping") return [];

    const elementKeys = element.fields.map((e) => e.name);

    elementKeys.map((e) => (map[e] = ""));

    value.forEach((element: any) => {
      elementKeys.forEach((elementKey) => {
        map[elementKey] =
          (map[elementKey] ? map[elementKey] + "|" : "") + element[elementKey];
      });
    });

    if (header)
      return elementKeys.map((k) => `${screen as string} ${key} ${k}`);
    return elementKeys.map((k) => (map[k] !== "" ? map[k] : "-"));
  } else {
    if (header) return [`${screen as string} ${key}`];
    if (value === "") return ["-"];
    return [value];
  }
}

export function convertObjectiveFieldsToArray(
  record: ObjectiveRecord,
  header = false
) {
  let final: any[] = [];

  [
    [objectivePregameKeys, "pregame"] as const,
    [objectiveTeleopKeys, "teleop"] as const,
    [objectiveEndgameKeys, "endgame"] as const,
    [objectiveInfoKeys, "info"] as const,
    [objectiveAutoKeys, "auto"] as const,
    [objectivePostgameKeys, "postgame"] as const,
    [objectiveOtherKeys, "other"] as const,
  ].forEach(([keys, screen]) => {
    keys.forEach((key) => {
      final = final.concat(elementToCell(key, screen, record, header));
    });
  });

  return final;
}

export function convertPitFieldsToArray(record: PitRecord, header = false) {
  let final: any[] = [];

  [
    [pitAutoKeys, "auto"] as const,
    [pitTeleopKeys, "teleop"] as const,
    [pitEndgameKeys, "endgame"] as const,
    [pitOtherKeys, "other"] as const,
    [pitInfoKeys, "info"] as const,
    [pitSpecificationsKeys, "specifications"] as const,
    [pitDriveKeys, "drive"] as const,
  ].forEach(([keys, screen]) => {
    keys.forEach((key) => {
      final = final.concat(elementToCell(key, screen, record, header));
    });
  });

  return final;
}

export function objectiveHeaders() {
  return convertObjectiveFieldsToArray(objectiveRecordDefault, true);
}

export function pitHeaders() {
  return convertPitFieldsToArray(pitRecordDefault, true);
}
