import { TBAMatch } from "@griffins-scout/api";
import {
  ObjectiveInfo,
  ObjectiveRecord,
  PitRecord,
  convertObjectiveFieldsToArray,
  convertPitFieldsToArray,
} from "@griffins-scout/game";
import {
  changeableLog,
  infoMessage,
  intervalWithBar,
  logInfo,
} from "@griffins-scout/logger";
import type {
  BaseExternalAccountClient,
  Compute,
  JWT,
  OAuth2Client,
  UserRefreshClient,
} from "google-auth-library";
import { GoogleAuth } from "google-auth-library";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth.js";
import { google } from "googleapis";
import { env } from "./utils/env.js";
import { client } from "./utils/trpc.js";
const sheets = google.sheets("v4");

const SHEET_ID = env.SHEET_ID;
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const KEY_FILE = env.CRED_PATH;

type SheetName = "Quant Import" | "TBA Import" | "Pit Import";
export type Auth =
  | string
  | JWT
  | UserRefreshClient
  | BaseExternalAccountClient
  | OAuth2Client
  | GoogleAuth<JSONClient>
  | Compute;

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
  return authToken as Compute;
}

export async function addObjectiveRecord(
  auth: Auth,
  record: ObjectiveRecord[]
) {
  await removeObjective(auth);

  const sheet: SheetName = "Quant Import";
  const request = {
    spreadsheetId: SHEET_ID,

    range: `'${sheet}'!A2:BZ2`,

    valueInputOption: "USER_ENTERED",

    resource: {
      range: `'${sheet}'!A2:BZ2`,
      majorDimension: "ROWS",
      values: record.map((r) => convertObjectiveFieldsToArray(r)),
      // values: record.map(r => objectiveHeaders())
    },

    auth,
  };

  try {
    const response = await sheets.spreadsheets.values.append(request);
  } catch (e) {
    console.log(e);
  }
}

// TODO- im not sure we need this running every
export async function addPitRecord(auth: Auth, record: PitRecord[]) {
  await removePit(auth);

  const sheet: SheetName = "Pit Import";

  const request = {
    spreadsheetId: SHEET_ID,

    range: `'${sheet}'!A2:BZ2`,

    valueInputOption: "USER_ENTERED",

    resource: {
      range: `'${sheet}'!A2:BZ2`,
      majorDimension: "ROWS",
      values: record.map((r) => convertPitFieldsToArray(r)),
      // values: record.map(r => pitHeaders())
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

export const compLevelToMatchType = (
  compLevel: TBAMatch["comp_level"]
): ObjectiveInfo["matchType"] => {
  if (compLevel === "qm") {
    return "Qualification";
  } else {
    return "Elimination";
  }
};

export async function removeMatches(auth: Auth) {
  const sheetName: SheetName = "TBA Import";

  const request = {
    spreadsheetId: SHEET_ID,

    // The A1 notation of the values to update.
    range: `'${sheetName}'!A${2}:BM${1000}`,

    auth,
  };

  try {
    const response = (await sheets.spreadsheets.values.clear(request)).data;
  } catch (err) {
    console.log(err);
  }
}

export async function removeObjective(auth: Auth) {
  const sheetName: SheetName = "Quant Import";

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

export async function removePit(auth: Auth) {
  const sheetName: SheetName = "Pit Import";

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

    record.push(match.winning_alliance);

    if (match.score_breakdown) {
      const bdn = match.score_breakdown.blue;

      record.push(bdn.adjustPoints);
      record.push(bdn.autoAmpNoteCount);
      record.push(bdn.autoAmpNotePoints);
      record.push(bdn.autoLeavePoints);

      if (i === 0) record.push(bdn.autoLineRobot1);
      if (i === 1) record.push(bdn.autoLineRobot2);
      if (i === 2) record.push(bdn.autoLineRobot3);

      record.push(bdn.autoPoints);
      record.push(bdn.autoSpeakerNoteCount);
      record.push(bdn.autoSpeakerNotePoints);
      record.push(bdn.autoTotalNotePoints);

      record.push(bdn.coopNotePlayed);
      record.push(bdn.coopertitionBonusAchieved);
      record.push(bdn.coopertitionCriteriaMet);

      record.push(bdn.endGameHarmonyPoints);
      record.push(bdn.endGameNoteInTrapPoints);
      record.push(bdn.endGameOnStagePoints);
      record.push(bdn.endGameParkPoints);

      if (i === 0) record.push(bdn.endGameRobot1);
      if (i === 1) record.push(bdn.endGameRobot2);
      if (i === 2) record.push(bdn.endGameRobot3);

      record.push(bdn.endGameSpotLightBonusPoints);
      record.push(bdn.endGameTotalStagePoints);
      record.push(bdn.ensembleBonusAchieved);
      record.push(bdn.ensembleBonusOnStageRobotsThreshold);
      record.push(bdn.ensembleBonusStagePointsThreshold);

      record.push(bdn.foulCount);
      record.push(bdn.foulPoints);

      record.push(bdn.g206Penalty);
      record.push(bdn.g408Penalty);
      record.push(bdn.g424Penalty);

      record.push(bdn.melodyBonusAchieved);
      record.push(bdn.melodyBonusThreshold);
      record.push(bdn.melodyBonusThresholdCoop);
      record.push(bdn.melodyBonusThresholdNonCoop);

      record.push(bdn.micCenterStage);
      record.push(bdn.micStageLeft);
      record.push(bdn.micStageRight);

      record.push(bdn.rp);

      record.push(bdn.techFoulCount);

      record.push(bdn.teleopAmpNoteCount);
      record.push(bdn.teleopAmpNotePoints);
      record.push(bdn.teleopPoints);

      record.push(bdn.teleopSpeakerNoteAmplifiedCount);
      record.push(bdn.teleopSpeakerNoteAmplifiedPoints);
      record.push(bdn.teleopSpeakerNoteCount);
      record.push(bdn.teleopSpeakerNotePoints);
      record.push(bdn.teleopTotalNotePoints);

      record.push(bdn.totalPoints);

      record.push(bdn.trapCenterStage);
      record.push(bdn.trapStageLeft);
      record.push(bdn.trapStageRight);
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

    record.push(match.winning_alliance);

    if (match.score_breakdown) {
      const bdn = match.score_breakdown.red;

      record.push(bdn.adjustPoints);
      record.push(bdn.autoAmpNoteCount);
      record.push(bdn.autoAmpNotePoints);
      record.push(bdn.autoLeavePoints);

      if (i === 0) record.push(bdn.autoLineRobot1);
      if (i === 1) record.push(bdn.autoLineRobot2);
      if (i === 2) record.push(bdn.autoLineRobot3);

      record.push(bdn.autoPoints);
      record.push(bdn.autoSpeakerNoteCount);
      record.push(bdn.autoSpeakerNotePoints);
      record.push(bdn.autoTotalNotePoints);

      record.push(bdn.coopNotePlayed);
      record.push(bdn.coopertitionBonusAchieved);
      record.push(bdn.coopertitionCriteriaMet);

      record.push(bdn.endGameHarmonyPoints);
      record.push(bdn.endGameNoteInTrapPoints);
      record.push(bdn.endGameOnStagePoints);
      record.push(bdn.endGameParkPoints);

      if (i === 0) record.push(bdn.endGameRobot1);
      if (i === 1) record.push(bdn.endGameRobot2);
      if (i === 2) record.push(bdn.endGameRobot3);

      record.push(bdn.endGameSpotLightBonusPoints);
      record.push(bdn.endGameTotalStagePoints);
      record.push(bdn.ensembleBonusAchieved);
      record.push(bdn.ensembleBonusOnStageRobotsThreshold);
      record.push(bdn.ensembleBonusStagePointsThreshold);

      record.push(bdn.foulCount);
      record.push(bdn.foulPoints);

      record.push(bdn.g206Penalty);
      record.push(bdn.g408Penalty);
      record.push(bdn.g424Penalty);

      record.push(bdn.melodyBonusAchieved);
      record.push(bdn.melodyBonusThreshold);
      record.push(bdn.melodyBonusThresholdCoop);
      record.push(bdn.melodyBonusThresholdNonCoop);

      record.push(bdn.micCenterStage);
      record.push(bdn.micStageLeft);
      record.push(bdn.micStageRight);

      record.push(bdn.rp);

      record.push(bdn.techFoulCount);

      record.push(bdn.teleopAmpNoteCount);
      record.push(bdn.teleopAmpNotePoints);
      record.push(bdn.teleopPoints);

      record.push(bdn.teleopSpeakerNoteAmplifiedCount);
      record.push(bdn.teleopSpeakerNoteAmplifiedPoints);
      record.push(bdn.teleopSpeakerNoteCount);
      record.push(bdn.teleopSpeakerNotePoints);
      record.push(bdn.teleopTotalNotePoints);

      record.push(bdn.totalPoints);

      record.push(bdn.trapCenterStage);
      record.push(bdn.trapStageLeft);
      record.push(bdn.trapStageRight);
    }

    final.push(record);
  });

  return final;
}

const main = async () => {
  // every 5 min
  // thats 300000 ms
  await update();

  intervalWithBar(async () => {
    await update();
  }, 5 * 60 * 1000);
};

main();

async function update() {
  // get data from controller
  // push data to sheet
  const auth = await getAuthToken();
  // const objectiveRecord: ObjectiveRecord[] = []; // getMatches()

  // await addObjectiveRecord(await auth, objectiveRecord)

  logInfo("Updating sheet...");

  const tbaDownloadStatus = changeableLog(
    infoMessage("Downloading TBA data...")
  );
  const matches = await client.blueAlliance.findAll.query();
  tbaDownloadStatus.update(infoMessage("Downloading TBA data... Done!"));
  tbaDownloadStatus.end();

  const tbaUploadStatus = changeableLog(infoMessage("Uploading TBA data..."));
  await addMatches(
    auth,
    matches.map((m) => m.content)
  );
  tbaUploadStatus.update(infoMessage("Uploading TBA data... Done!"));
  tbaUploadStatus.end();

  const objectiveDownloadStatus = changeableLog(
    infoMessage("Downloading objective data...")
  );
  const objectiveRecords = await client.objective.findAll.query();
  objectiveDownloadStatus.update(
    infoMessage("Downloading objective data... Done!")
  );
  objectiveDownloadStatus.end();

  const objectiveUploadStatus = changeableLog(
    infoMessage("Uploading objective data...")
  );
  await addObjectiveRecord(
    auth,
    objectiveRecords.map((m) => m.content)
  );
  objectiveUploadStatus.update(
    infoMessage("Uploading objective data... Done!")
  );
  objectiveUploadStatus.end();

  const pitDownloadStatus = changeableLog(
    infoMessage("Downloading pit data...")
  );
  const pitRecords = await client.pit.findAll.query();
  pitDownloadStatus.update(infoMessage("Downloading pit data... Done!"));
  pitDownloadStatus.end();

  const pitUploadStatus = changeableLog(infoMessage("Uploading pit data..."));
  await addPitRecord(
    auth,
    pitRecords.map((m) => m.content)
  );
  pitUploadStatus.update(infoMessage("Uploading pit data... Done!"));
  pitUploadStatus.end();

  logInfo("Sheet update complete!");
}
