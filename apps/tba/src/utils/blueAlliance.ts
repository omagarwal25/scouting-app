import { TBAMatch } from "@griffins-scout/api";
import { ObjectiveInfo } from "@griffins-scout/game";
import got from "got";

import { env } from "./env.js";

const tbaBaseUrl = "https://www.thebluealliance.com/api/v3";

export const getMatches = async () => {
  const eventCode = env.EVENT_CODE;

  return got(`${tbaBaseUrl}/event/${eventCode}/matches`, {
    headers: {
      "X-TBA-Auth-Key": env.X_TBA_AUTH_KEY,
    },
  }).json<TBAMatch[]>();
};

// export const getTeam = async (teamNumber: number) => {
//   return got(`${tbaBaseUrl}/team/frc${teamNumber}`, {
//     headers: {
//       "X-TBA-Auth-Key": env.X_TBA_AUTH_KEY,
//     },
//   }).json<TBATeam>();
// };

// export const teamKeyToNumber = (teamKey: string) => {
//   return parseInt(teamKey.split("frc")[1]);
// };

export const compLevelToMatchType = (
  compLevel: TBAMatch["comp_level"]
): ObjectiveInfo["matchType"] => {
  if (compLevel === "qm") {
    return "Qualification";
  } else {
    return "Elimination";
  }
};
