import {
  game,
  objectiveAutoKeys,
  objectiveEndgameKeys,
  objectiveInfoKeys,
  objectiveOtherKeys,
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
} from "@griffins-scout/game";
import type {
  BaseExternalAccountClient,
  Compute,
  Impersonated,
  JWT,
  UserRefreshClient,
} from "google-auth-library";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { Community, TBAMatch } from "../interfaces/match.js";
import { compLevelToMatchType } from "./blueAlliance.js";
import { env } from "./env.js";
const sheets = google.sheets("v4");
const SHEET_ID = env.SHEET_ID;
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const KEY_FILE = env.CRED_PATH;

type SheetName = "Quant Import" | "TBA Import" | "Pit Import" | "Subj Import";
export type Auth =
  | JWT
  | Compute
  | UserRefreshClient
  | BaseExternalAccountClient
  | Impersonated;

/**
 * getAuthToken - authenticates the service account and returns an auth token
 *
 * @return authentication token for use in requests
 */
export async function getAuthToken() {
  const auth = new GoogleAuth({
    keyFilename: KEY_FILE,
    scopes: SCOPES,
  });

  const authToken = await auth.getClient();
  return authToken;
}

/**
 * getSpreadSheet - gets metadata of a spreadsheet
 *
 * @param  spreadsheetId sheet id to retrieve
 * @param  auth authToken
 * @return all sheet information
 */
async function getSpreadSheet(spreadsheetId: string, auth: Auth) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

function screenToArray<T extends Record<string, any>, K extends keyof T>(
  key: string,
  screen: K,
  record: T
): string[] {
  const value: any =
    record[screen as keyof typeof record][
      key as keyof typeof record[typeof screen]
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
          (map[elementKey] ? map[elementKey] + "," : "") + element[elementKey];
      });
    });

    return elementKeys.map((key) => (map[key] !== "" ? map[key] : "-"));
  } else {
    if (value === "") return ["-"];
    else return [value];
  }
}

function convertObjectiveFieldsToArray(record: ObjectiveRecord) {
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
      final = final.concat(screenToArray(key, screen, record));
    });
  });

  return final;
}

function convertSubjectiveFieldsToArray(record: SubjectiveRecord) {
  // we want to flatten the whole record into an array
  // so we can easily add it to the sheet

  let one: any[] = [];

  [
    [subjectiveTeamKeys, "teamOne"] as const,
    [subjectiveOtherKeys, "other"] as const,
    [
      subjectiveInfoKeys.filter(
        (e) => e !== "teamThreeNumber" && e !== "teamTwoNumber"
      ),
      "info",
    ] as const,
  ].forEach(([keySet, screen]) => {
    keySet.forEach((key) => {
      one = one.concat(screenToArray(key, screen, record));
    });
  });

  let two: any[] = [];

  [
    [subjectiveTeamKeys, "teamTwo"] as const,
    [subjectiveOtherKeys, "other"] as const,
    [
      subjectiveInfoKeys.filter(
        (e) => e !== "teamOneNumber" && e !== "teamThreeNumber"
      ),
      "info",
    ] as const,
  ].forEach(([keySet, screen]) => {
    keySet.forEach((key) => {
      two = two.concat(screenToArray(key, screen, record));
    });
  });

  let three: any[] = [];

  [
    [subjectiveTeamKeys, "teamThree"] as const,
    [subjectiveOtherKeys, "other"] as const,
    [
      subjectiveInfoKeys.filter(
        (e) => e !== "teamOneNumber" && e !== "teamTwoNumber"
      ),
      "info",
    ] as const,
  ].forEach(([keySet, screen]) => {
    keySet.forEach((key) => {
      three = three.concat(screenToArray(key, screen, record));
    });
  });

  return [one, two, three];
}

function convertPitFieldsToArray(record: PitRecord) {
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
      final = final.concat(screenToArray(key, screen, record));
    });
  });

  return final;
}

function communityToArray(community: Community) {
  const final = [];

  const top = community.T;
  const bottom = community.B;
  const middle = community.M;

  final.push(top.filter((t) => t === "Cone").length);
  final.push(top.filter((t) => t === "Cube").length);
  final.push(middle.filter((t) => t === "Cone").length);
  final.push(middle.filter((t) => t === "Cube").length);
  final.push(bottom.filter((t) => t === "Cone").length);
  final.push(bottom.filter((t) => t === "Cube").length);

  return final;
}

function convertMatchToArray(match: TBAMatch): any[][] {
  const final: any[][] = [];

  match.alliances.blue.team_keys.forEach((number, i) => {
    let record: any[] = [];

    record.push("blue");
    record.push(i + 1);
    record.push(number.replace("frc", ""));
    record.push(compLevelToMatchType(match.comp_level));
    record.push(match.event_key);
    record.push(match.key);
    record.push(match.match_number);
    record.push(match.set_number);
    record.push(match.post_result_time ?? 0);
    record.push(match.actual_time ?? 0);
    record.push(match.time ?? 0);
    record.push(match.predicted_time ?? 0);
    record.push(
      match.videos.length === 0 ? "None" : JSON.stringify(match.videos)
    );
    record.push(match.winning_alliance);

    if (match.score_breakdown) {
      const g = match.score_breakdown.blue;

      record.push(g.activationBonusAchieved);
      record.push(g.autoBridgeState);
      record.push(g.autoChargeStationPoints);

      if (i === 0) record.push(g.autoChargeStationRobot1);
      if (i === 1) record.push(g.autoChargeStationRobot2);
      if (i === 2) record.push(g.autoChargeStationRobot3);

      if (i === 0) record.push(g.mobilityRobot1);
      if (i === 1) record.push(g.mobilityRobot2);
      if (i === 2) record.push(g.mobilityRobot3);

      record = record.concat(
        g.autoCommunity ? communityToArray(g.autoCommunity) : [0, 0, 0, 0, 0, 0]
      );

      record.push(g.autoDocked);
      record.push(g.autoGamePieceCount);
      record.push(g.autoGamePiecePoints);
      record.push(g.autoMobilityPoints);
      record.push(g.autoPoints);
      record.push(g.coopGamePieceCount);

      record = record.concat(communityToArray(g.teleopCommunity));

      record.push(g.teleopGamePieceCount);
      record.push(g.teleopGamePiecePoints);

      record.push(g.totalChargeStationPoints);
      record.push(g.totalPoints);

      record.push(g.endGameBridgeState);
      if (i === 0) record.push(g.endGameChargeStationRobot1);
      if (i === 1) record.push(g.endGameChargeStationRobot2);
      if (i === 2) record.push(g.endGameChargeStationRobot3);

      record.push(g.foulCount);
      record.push(g.foulPoints);
      record.push(g.techFoulCount);

      record.push(g.linkPoints);

      record.push(g.rp);
      record.push(g.sustainabilityBonusAchieved);
    }

    final.push(record);
  });

  match.alliances.red.team_keys.forEach((number, i) => {
    let record: any[] = [];

    record.push("red");
    record.push(i + 1);
    record.push(number.replace("frc", ""));
    record.push(compLevelToMatchType(match.comp_level));
    record.push(match.event_key);
    record.push(match.key);
    record.push(match.match_number);
    record.push(match.set_number);
    record.push(match.post_result_time ?? 0);
    record.push(match.actual_time ?? 0);
    record.push(match.time ?? 0);
    record.push(match.predicted_time ?? 0);
    record.push(
      match.videos.length === 0 ? "None" : JSON.stringify(match.videos)
    );
    record.push(match.winning_alliance);

    if (match.score_breakdown) {
      const g = match.score_breakdown.red;

      record.push(g.activationBonusAchieved);
      record.push(g.autoBridgeState);
      record.push(g.autoChargeStationPoints);

      if (i === 0) record.push(g.autoChargeStationRobot1);
      if (i === 1) record.push(g.autoChargeStationRobot2);
      if (i === 2) record.push(g.autoChargeStationRobot3);

      if (i === 0) record.push(g.mobilityRobot1);
      if (i === 1) record.push(g.mobilityRobot2);
      if (i === 2) record.push(g.mobilityRobot3);

      record = record.concat(
        g.autoCommunity ? communityToArray(g.autoCommunity) : [0, 0, 0, 0, 0, 0]
      );

      record.push(g.autoDocked);
      record.push(g.autoGamePieceCount);
      record.push(g.autoGamePiecePoints);
      record.push(g.autoMobilityPoints);
      record.push(g.autoPoints);
      record.push(g.coopGamePieceCount);

      record = record.concat(communityToArray(g.teleopCommunity));

      record.push(g.teleopGamePieceCount);
      record.push(g.teleopGamePiecePoints);

      record.push(g.totalChargeStationPoints);
      record.push(g.totalPoints);

      record.push(g.endGameBridgeState);
      if (i === 0) record.push(g.endGameChargeStationRobot1);
      if (i === 1) record.push(g.endGameChargeStationRobot2);
      if (i === 2) record.push(g.endGameChargeStationRobot3);

      record.push(g.foulCount);
      record.push(g.foulPoints);
      record.push(g.techFoulCount);

      record.push(g.linkPoints);

      record.push(g.rp);
      record.push(g.sustainabilityBonusAchieved);
    }

    final.push(record);
  });

  return final;
}

/**
 * getSpreadSheetValues - returns values for a specific tab in a sheet
 *
 * @param  spreadsheetId sheet id to retrieve
 * @param  auth authToken
 * @param  sheetName tab to get
 * @return sheet values
 */
async function getSpreadSheetValues(
  spreadsheetId: string,
  auth: Auth,
  sheetName: SheetName
) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName,
    valueRenderOption: "FORMULA",
  });
  return res;
}

/**
 * addProposal - adds a proposal to the bottom of a sheet
 *
 * @param  auth authToken
 * @param  proposal proposal object to add
 * @param  [sheet="In Progress"] sheet to add proposal to
 * @return append response from google, else returns error
 */
export async function addObjectiveRecord(
  auth: Auth,
  record: ObjectiveRecord[]
) {
  const sheet: SheetName = "Quant Import";
  const request = {
    spreadsheetId: SHEET_ID,

    range: `'${sheet}'!A2:BZ2`,

    valueInputOption: "USER_ENTERED",

    resource: {
      range: `'${sheet}'!A2:BZ2`,
      majorDimension: "ROWS",
      values: record.map(convertObjectiveFieldsToArray),
    },

    auth,
  };

  try {
    const response = await sheets.spreadsheets.values.append(request);
  } catch (e) {
    console.log(e);
  }
}

export async function addSubjectiveRecord(
  auth: Auth,
  record: SubjectiveRecord[]
) {
  const sheet: SheetName = "Subj Import";

  const request = {
    spreadsheetId: SHEET_ID,

    range: `'${sheet}'!A2:BZ2`,

    valueInputOption: "USER_ENTERED",

    resource: {
      range: `'${sheet}'!A2:BZ2`,
      majorDimension: "ROWS",
      values: record.map(convertSubjectiveFieldsToArray),
    },

    auth,
  };

  try {
    const response = await sheets.spreadsheets.values.append(request);
  } catch (e) {
    console.log(e);
  }
}

export async function addPitRecord(auth: Auth, record: PitRecord[]) {
  const sheet: SheetName = "Pit Import";

  const request = {
    spreadsheetId: SHEET_ID,

    range: `'${sheet}'!A2:BZ2`,

    valueInputOption: "USER_ENTERED",

    resource: {
      range: `'${sheet}'!A2:BZ2`,
      majorDimension: "ROWS",
      values: record.map(convertPitFieldsToArray),
    },

    auth,
  };

  try {
    const response = await sheets.spreadsheets.values.append(request);
  } catch (e) {
    console.log(e);
  }
}

export async function addMatches(auth: Auth, record: TBAMatch[]) {
  const sheet: SheetName = "TBA Import";

  await removeMatches(auth);

  const request = {
    // The ID of the spreadsheet to update.
    spreadsheetId: SHEET_ID,

    // The A1 notation of a range to search for a logical table of data.
    // Values are appended after the last row of the table.
    range: `'${sheet}'!A2:BZ2`,

    // How the input data should be interpreted.
    valueInputOption: "USER_ENTERED",

    resource: {
      range: `'${sheet}'!A2:BZ2`,
      majorDimension: "ROWS",
      values: record.map(convertMatchToArray).flat(),
    },

    auth,
  };

  try {
    const response = sheets.spreadsheets.values.append(request);
  } catch (e) {
    console.log(e);
  }
}

export async function removeMatches(auth: Auth) {
  const sheetName: SheetName = "TBA Import";

  const request = {
    spreadsheetId: SHEET_ID,

    // The A1 notation of the values to update.
    range: `'${sheetName}'!A${2}:AZ${1000}`,

    auth,
  };

  try {
    const response = (await sheets.spreadsheets.values.clear(request)).data;
  } catch (err) {
    console.log(err);
  }
}
