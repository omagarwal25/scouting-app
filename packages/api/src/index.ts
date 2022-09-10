import { Info } from "@griffins-scout/game";
import type { MatchType } from "../../../apps/controller/src/server";

export type {
  AppRouter,
  Match,
  MatchType,
  Record,
  Team,
} from "../../../apps/controller/src/server";

export const infoMatchTypeToMatchType = (
  infoMatchType: Info["matchType"]
): MatchType => {
  const map = new Map<Info["matchType"], MatchType>([
    ["Final", "FINAL"],
    ["Qualification", "QUALIFICATION"],
    ["Practice", "PRACTICE"],
    ["Semifinal", "SEMIFINAL"],
    ["Quarterfinal", "QUARTERFINAL"],
  ]);

  return map.get(infoMatchType) ?? "PRACTICE";
};
