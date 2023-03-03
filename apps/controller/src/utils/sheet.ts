import {
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
const KEY_FILE =
  "/Users/oma/Documents/Coding/scouting-app/apps/controller/credentials.json";

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

function convertObjectiveFieldsToArray(record: ObjectiveRecord) {
  // we want to flatten the whole record into an array
  // so we can easily add it to the sheet

  let final: any[] = [];

  [
    [objectivePregameKeys, "pregame"] as const,
    [objectiveTeleopKeys, "teleop"] as const,
    [objectiveEndgameKeys, "endgame"] as const,
    [objectiveInfoKeys, "info"] as const,
    [objectiveAutoKeys, "auto"] as const,
    [objectivePostgameKeys, "postgame"] as const,
    [objectiveOtherKeys, "other"] as const,
  ].forEach(([keySet, screen]) => {
    keySet.forEach((key) => {
      const value: any =
        record[screen as keyof typeof record][
          key as keyof typeof record[typeof screen]
        ];

      if (typeof value === "object") {
        // this means it's a nested object or array
        // we only have have arrays of nested objects

        // we want to convert the elements so that they are csv values of each field
        // so its ["a,a,a", "b,b,b", "c,c,c"]

        // convert each element to an array first

        const map: Record<string, any> = {};

        value.forEach((element: any) => {
          const elementKeys = Object.keys(element);
          elementKeys.forEach((elementKey) => {
            map[elementKey] =
              (map[elementKey] ? map[elementKey] + "," : "") +
              element[elementKey];
          });
        });

        const elementKeys = Object.keys(map);
        const e = elementKeys.map((key) => map[key]);

        final = final.concat(e);
      } else {
        if (value === "") final.push("-");
        final.push(`${screen} ${key}`);
      }
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
      const value: any =
        record[screen as keyof typeof record][
          key as keyof typeof record[typeof screen]
        ];

      if (typeof value === "object") {
        // this means it's a nested object or array
        // we only have have arrays of nested objects

        // we want to convert the elements so that they are csv values of each field
        // so its ["a,a,a", "b,b,b", "c,c,c"]

        // convert each element to an array first

        const map: Record<string, any> = {};

        value.forEach((element: any) => {
          const elementKeys = Object.keys(element);
          elementKeys.forEach((elementKey) => {
            map[elementKey] =
              (map[elementKey] ? map[elementKey] + "," : "") +
              element[elementKey];
          });
        });

        const elementKeys = Object.keys(map);
        const e = elementKeys.map((key) => map[key]);

        one = one.concat(e);
      } else {
        if (value === "") one.push("-");
        one.push(value);
      }
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
      const value: any =
        record[screen as keyof typeof record][
          key as keyof typeof record[typeof screen]
        ];

      if (typeof value === "object") {
        // this means it's a nested object or array
        // we only have have arrays of nested objects

        // we want to convert the elements so that they are csv values of each field
        // so its ["a,a,a", "b,b,b", "c,c,c"]

        // convert each element to an array first

        const map: Record<string, any> = {};

        value.forEach((element: any) => {
          const elementKeys = Object.keys(element);
          elementKeys.forEach((elementKey) => {
            map[elementKey] =
              (map[elementKey] ? map[elementKey] + "," : "") +
              element[elementKey];
          });
        });

        const elementKeys = Object.keys(map);
        const e = elementKeys.map((key) => map[key]);

        two = two.concat(e);
      } else {
        if (value === "") two.push("-");
        two.push(value);
      }
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
      const value: any =
        record[screen as keyof typeof record][
          key as keyof typeof record[typeof screen]
        ];

      if (typeof value === "object") {
        // this means it's a nested object or array
        // we only have have arrays of nested objects

        // we want to convert the elements so that they are csv values of each field
        // so its ["a,a,a", "b,b,b", "c,c,c"]

        // convert each element to an array first

        const map: Record<string, any> = {};

        value.forEach((element: any) => {
          const elementKeys = Object.keys(element);
          elementKeys.forEach((elementKey) => {
            map[elementKey] =
              (map[elementKey] ? map[elementKey] + "," : "") +
              element[elementKey];
          });
        });

        const elementKeys = Object.keys(map);
        const e = elementKeys.map((key) => map[key]);

        three = three.concat(e);
      } else {
        if (value === "") three.push("-");
        three.push(value);
      }
    });
  });

  return [one, two, three];
}

function convertPitFieldsToArray(record: PitRecord) {
  // we want to flatten the whole record into an array
  // so we can easily add it to the sheet

  let final: any[] = [];

  [
    [pitAutoKeys, "auto"] as const,
    [pitTeleopKeys, "teleop"] as const,
    [pitEndgameKeys, "endgame"] as const,
    [pitOtherKeys, "other"] as const,
    [pitInfoKeys, "info"] as const,
    [pitSpecificationsKeys, "specifications"] as const,
    [pitDriveKeys, "drive"] as const,
  ].forEach(([keySet, screen]) => {
    keySet.forEach((key) => {
      const value: any =
        record[screen as keyof typeof record][
          key as keyof typeof record[typeof screen]
        ];

      if (typeof value === "object") {
        // this means it's a nested object or array
        // we only have have arrays of nested objects

        // we want to convert the elements so that they are csv values of each field
        // so its ["a,a,a", "b,b,b", "c,c,c"]

        // convert each element to an array first

        const map: Record<string, any> = {};

        value.forEach((element: any) => {
          const elementKeys = Object.keys(element);
          elementKeys.forEach((elementKey) => {
            map[elementKey] =
              (map[elementKey] ? map[elementKey] + "," : "") +
              element[elementKey];
          });
        });

        const elementKeys = Object.keys(map);
        const e = elementKeys.map((key) => key);

        final = final.concat(e);
      } else {
        if (value === "") final.push("-");
        final.push(`${screen} ${key}`);
      }
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

// function convertSubjectiveFieldsToArray(record: SubjectiveRecord) {
//   const final: any[] = [];

//   [[
//     subjectiveTeamKeys, "teamOne"
//   ], [
//     subjectiveTeamKeys, "teamTwo"
//     ], [
//       subjectiveTeamKeys, "teamThree"
//     ], [subjectiveInfoKeys, "info"],
//     [subjectiveOtherKeys, "other"]].forEach(([keySet, screen]) => {

// }

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
export async function addObjectiveRecord(auth: Auth, record: ObjectiveRecord) {
  const sheet: SheetName = "Quant Import";
  const request = {
    spreadsheetId: SHEET_ID,

    range: `'${sheet}'!A2:BZ2`,

    valueInputOption: "USER_ENTERED",

    resource: {
      range: `'${sheet}'!A2:BZ2`,
      majorDimension: "ROWS",
      values: [convertObjectiveFieldsToArray(record)],
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
  record: SubjectiveRecord
) {
  const sheet: SheetName = "Subj Import";
  console.log(convertSubjectiveFieldsToArray(record));
  const request = {
    spreadsheetId: SHEET_ID,

    range: `'${sheet}'!A2:BZ2`,

    valueInputOption: "USER_ENTERED",

    resource: {
      range: `'${sheet}'!A2:BZ2`,
      majorDimension: "ROWS",
      values: convertSubjectiveFieldsToArray(record),
    },

    auth,
  };

  try {
    const response = await sheets.spreadsheets.values.append(request);
    console.log(response);
  } catch (e) {
    console.log(e);
  }
}

export async function addPitRecord(auth: Auth, record: PitRecord) {
  console.log("HELLO THERE");
  const sheet: SheetName = "Pit Import";
  console.log(convertPitFieldsToArray(record));
  const request = {
    spreadsheetId: SHEET_ID,

    range: `'${sheet}'!A2:BZ2`,

    valueInputOption: "USER_ENTERED",

    resource: {
      range: `'${sheet}'!A2:BZ2`,
      majorDimension: "ROWS",
      values: [convertPitFieldsToArray(record)],
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
  // record.map(convertMatchToArray).map((match) => console.log(match.join(", ")));

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

  // console.log("eq", request.resource.values[0]);
  try {
    const response = sheets.spreadsheets.values.append(request);
  } catch (e) {
    console.log(e);
  }
  // console.log(response, "hi");
  // console.log(JSON.stringify(response, null, 2));
  // return response;
}

// /**
//  * parseSheetDate - parses a date from the google sheet into a unix timestamp
//  *
//  * @param  date input string from sheet
//  * @return unix timestamp
//  */
// function parseSheetDate(date: string) {
//   if (date == undefined) return undefined;

//   const parsedDate = String(date);

//   let outDate;

//   if (parsedDate.split("/").length == 3) outDate = new Date(date).getTime();
//   else outDate = parseInt(parsedDate.split("/")[0].slice(1));

//   if (isNaN(outDate)) return undefined;
//   else return outDate;
// }

// /**
//  * parseSheetProposals - parses a list  of objections into an array
//  *
//  * @param  rawInput objections from sheet
//  * @return parsed objections
//  */
// function parseSheetProposals(rawInput: string) {
//   try {
//     let array = rawInput.split(",");
//     array.forEach((item, i) => {
//       array[i] = item.trim();
//     });
//     return array;
//   } catch {
//     return undefined;
//   }
// }

// function parseJsonFromSheet(rawInput: string) {
//   try {
//     let parsed = JSON.parse(rawInput);
//     return parsed;
//   } catch {
//     return rawInput;
//   }
// }

// /**
//  * arrayToProposal - converts an array from a sheet into a proposal object
//  *
//  * @param  input array to convert
//  * @return converted proposal object
//  */
// function arrayToProposal(input: string[]) {
//   let newProposal: Proposal = {
//     uuid: input[0],
//     name: input[1],
//     proposedBy: input[2],
//     type: input[3],
//     description: input[4],
//     coordinates: input[5] || undefined,
//     imageLink: input[6] || undefined,
//     threadLink: input[7],
//     dateProposed: parseSheetDate(input[8]) ?? 0,
//     actionDate: parseSheetDate(input[9]),
//     objections: parseSheetProposals(input[10]) ?? ["0"],
//     numExtensions: parseInt(input[11]),
//     otherJson: parseJsonFromSheet(input[12]),
//   };

//   return newProposal;
// }

// /**
//  * getAllProposals - gets all proposals from the sheet
//  *
//  * @param auth authToken
//  * @return all proposals object
//  */
// export async function getAllProposals(auth: Auth) {
//   let sheetsToIterate: SheetName[] = [
//     "Approved",
//     "In Progress",
//     "Denied/Postponed",
//   ];

//   let output: AllProposals = {
//     approved: [],
//     denied: [],
//     inProgress: [],
//     all: [],
//   };

//   let gettingSheets = new Promise((resolve) => {
//     let numToResolve = sheetsToIterate.length;
//     sheetsToIterate.forEach(async (sheetName) => {
//       let spreadsheet = await getSpreadSheetValues(SHEET_ID, auth, sheetName);
//       let values = spreadsheet.data.values;

//       if (values) {
//         values.shift(); //ignore title rows
//         //values.shift();

//         values.forEach((value: string[]) => {
//           const proposal = arrayToProposal(value);
//           switch (sheetName) {
//             case "Approved":
//               output.approved.push(proposal);
//               break;
//             case "In Progress":
//               output.inProgress.push(proposal);
//               break;
//             case "Denied/Postponed":
//               output.denied.push(proposal);
//               break;
//           }
//           output.all.push(proposal);
//         });

//         numToResolve--;
//         if (numToResolve == 0) resolve(true);
//       }
//     });
//   });

//   await gettingSheets;
//   return output;
// }

// /**
//  * deDupe - same as "remove duplicates" in sheets.
//  * doesn't cross-check between tabs
//  *
//  * @param  authToken
//  * @return batch response from google or error
//  */
// export async function deDupe(auth: Auth) {
//   const request = {
//     // The spreadsheet to apply the updates to.
//     spreadsheetId: SHEET_ID,

//     resource: {
//       requests: [
//         {
//           deleteDuplicates: {
//             range: {
//               sheetId: 0,
//               startRowIndex: 0,
//               startColumnIndex: 0,
//               endColumnIndex: 11,
//             },
//             comparisonColumns: [
//               {
//                 sheetId: 0,
//                 dimension: "COLUMNS",
//                 startIndex: 0,
//                 endIndex: 11,
//               },
//             ],
//           },
//         },
//         {
//           deleteDuplicates: {
//             range: {
//               sheetId: 218609302,
//               startRowIndex: 0,
//               startColumnIndex: 0,
//               endColumnIndex: 11,
//             },
//             comparisonColumns: [
//               {
//                 sheetId: 218609302,
//                 dimension: "COLUMNS",
//                 startIndex: 0,
//                 endIndex: 11,
//               },
//             ],
//           },
//         },
//         {
//           deleteDuplicates: {
//             range: {
//               sheetId: 106354102,
//               startRowIndex: 0,
//               startColumnIndex: 0,
//               endColumnIndex: 11,
//             },
//             comparisonColumns: [
//               {
//                 sheetId: 106354102,
//                 dimension: "COLUMNS",
//                 startIndex: 0,
//                 endIndex: 11,
//               },
//             ],
//           },
//         },
//       ],
//     },

//     auth,
//   };

//   try {
//     const response = (await sheets.spreadsheets.batchUpdate(request)).data;
//     return response;
//   } catch (err) {
//     return err;
//   }
// }

// /**
//  * removeProposal - removes a proposal from the sheet
//  *
//  * @param  auth authToken
//  * @param  proposalId id of the proposal to remove
//  * @param  [allProposals] list of all proposals and their locations, will be retrieved if not provided
//  * @return list of all proposals
//  */
export async function removeMatches(auth: Auth) {
  const sheetName: SheetName = "TBA Import";

  console.log("clearing sheet");

  const request = {
    spreadsheetId: SHEET_ID,

    // The A1 notation of the values to update.
    range: `'${sheetName}'!A${2}:AZ${1000}`,

    auth,
  };

  try {
    const response = (await sheets.spreadsheets.values.clear(request)).data;
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

// //just some demo testing functions below
// // getAuthToken().then((authToken) => {
// //   let newProposal: Proposal = {
// //     uid: 24,
// //     name: "Test Proposal",
// //     proposedBy: "scary",
// //     type: "town",
// //     description: "a thing",
// //     threadLink: "https://google.com",
// //     dateProposed: Date.now(),
// //   };
// // getAllProposals(authToken).then(console.log);
// //
// // addProposal(authToken, newProposal).then((result) => {
// //   console.log(result);
// // });
// //
// // removeProposal(authToken, 24);
// //
// // deDupe(authToken).then(console.log);
// // });
