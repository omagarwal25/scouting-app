import {
  ObjectiveRecord,
  PitRecord,
  convertObjectiveFieldsToArray,
  convertPitFieldsToArray,
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
import { TBAMatch } from "../interfaces/match.js";
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
      values: record.map((r) => convertObjectiveFieldsToArray(r)),
    },

    auth,
  };

  try {
    const response = await sheets.spreadsheets.values.append(request);
  } catch (e) {
    console.log(e);
  }
}

// export async function addSubjectiveRecord(
//   auth: Auth,
//   record: SubjectiveRecord[]
// ) {
//   const sheet: SheetName = "Subj Import";

//   const request = {
//     spreadsheetId: SHEET_ID,

//     range: `'${sheet}'!A2:BZ2`,

//     valueInputOption: "USER_ENTERED",

//     resource: {
//       range: `'${sheet}'!A2:BZ2`,
//       majorDimension: "ROWS",
//       values: record.map((r) => convertSubjectiveFieldsToArray(r)).flat(),
//     },

//     auth,
//   };

//   try {
//     const response = await sheets.spreadsheets.values.append(request);
//     console.log(response);
//   } catch (e) {
//     console.log(e);
//   }
// }

export async function addPitRecord(auth: Auth, record: PitRecord[]) {
  const sheet: SheetName = "Pit Import";

  const request = {
    spreadsheetId: SHEET_ID,

    range: `'${sheet}'!A2:BZ2`,

    valueInputOption: "USER_ENTERED",

    resource: {
      range: `'${sheet}'!A2:BZ2`,
      majorDimension: "ROWS",
      values: record.map((r) => convertPitFieldsToArray(r)),
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
  //
  // await removeMatches(auth);
  //
  // const request = {
  //   // The ID of the spreadsheet to update.
  //   spreadsheetId: SHEET_ID,
  //
  //   // The A1 notation of a range to search for a logical table of data.
  //   // Values are appended after the last row of the table.
  //   range: `'${sheet}'!A2:BZ2`,
  //
  //   // How the input data should be interpreted.
  //   valueInputOption: "USER_ENTERED",
  //
  //   resource: {
  //     range: `'${sheet}'!A2:BZ2`,
  //     majorDimension: "ROWS",
  //     values: record.map(convertMatchToArray).flat(),
  //   },
  //
  // };
  //
  // try {
  //   const response = sheets.spreadsheets.values.append(request);
  // } catch (e) {
  //   console.log(e);
  // }
}

export async function removeMatches(auth: Auth) {
  // const sheetName: SheetName = "TBA Import";
  //
  // const request = {
  //   spreadsheetId: SHEET_ID,
  //
  //   // The A1 notation of the values to update.
  //   range: `'${sheetName}'!A${2}:AZ${1000}`,
  //
  //   auth,
  // };
  //
  // try {
  //   const response = (await sheets.spreadsheets.values.clear(request)).data;
  // } catch (err) {
  //   console.log(err);
  // }
}
