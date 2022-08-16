import got from "got";
import { TBAMatch } from "../interfaces/match";
import { TBATeam } from "../interfaces/team";
import { env } from "./env";

const tbaBaseUrl = "https://www.thebluealliance.com/api/v3";

export const getMatches = async () => {
  const eventCode = env.EVENT_CODE;

  return got(`${tbaBaseUrl}/event/${eventCode}/matches`, {
    json: true,
    headers: {
      "X-TBA-Auth-Key": env.X_TBA_AUTH_KEY,
    },
  }).json<TBAMatch[]>();
};

export const getTeam = async (teamNumber: number) => {
  return got(`${tbaBaseUrl}/team/${teamNumber}`, {
    json: true,
    headers: {
      "X-TBA-Auth-Key": env.X_TBA_AUTH_KEY,
    },
  }).json<TBATeam>();
};
