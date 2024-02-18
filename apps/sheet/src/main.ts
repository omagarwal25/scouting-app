import { client } from "./utils/trpc.js";
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
import {env} from "@griffins-scout/controller/dist/src/utils/env";
const sheets = google.sheets("v4");

const SHEET_ID = env.SHEET_ID;
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const KEY_FILE = env.CRED_PATH;

type SheetName = "Quant Import" | "TBA Import" | "Pit Import";
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

// TODO- im not sure we need this running every
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

const main = async () => {
    // every 5 min
    // thats 300000 ms
    setInterval(async () => {
        // get data from controller
        // push data to sheet
        const auth = getAuthToken();
        const objectiveRecord: ObjectiveRecord[] = []; // getMatches()

        await addObjectiveRecord(await auth, objectiveRecord)
    }, 5 * 60 * 1000);
};

main();
