import type { MatchType } from "@prisma/client";
import got from "got";

import type { TBAMatch } from "../interfaces/match.js";
import type { TBATeam } from "../interfaces/team.js";
import { env } from "./env.js";

const tbaBaseUrl = "https://www.thebluealliance.com/api/v3";

export const getMatches = async () => {
  const eventCode = env.EVENT_CODE;

  console.log(`${tbaBaseUrl}/event/${eventCode}/matches`);

  return got(`${tbaBaseUrl}/event/${eventCode}/matches`, {
    headers: {
      "X-TBA-Auth-Key": env.X_TBA_AUTH_KEY,
    },
  }).json<TBAMatch[]>();
};

export const getTeam = async (teamNumber: number) => {
  return got(`${tbaBaseUrl}/team/frc${teamNumber}`, {
    headers: {
      "X-TBA-Auth-Key": env.X_TBA_AUTH_KEY,
    },
  }).json<TBATeam>();
};

export const compLevelToMatchType = (
  level: TBAMatch["comp_level"]
): MatchType => {
  if (level === "f") return "FINAL";
  else if (level === "sf") return "SEMIFINAL";
  else if (level === "qf") return "QUARTERFINAL";
  else return "QUALIFICATION";
};

export const teamKeyToNumber = (teamKey: string) => {
  return parseInt(teamKey.split("frc")[1]);
};

export const matchToMatchLevel = (match: TBAMatch) => {
  const matchType = compLevelToMatchType(match.comp_level);

  if (["FINAL", "QUALIFICATION", "PRACTICE"].includes(matchType)) {
    return match.match_number;
  }

  const totalSets = matchType === "SEMIFINAL" ? 2 : 4;

  return (match.match_number - 1) * totalSets + match.set_number;
};
