import { Info } from "@griffins-scout/game";
import { Station } from "../../../apps/controller/src/server";

export type {
  AppRouter,
  Game,
  Record,
  Team,
  GameType,
  Station,
} from "../../../apps/controller/src/server";

export const stationToScoutID: Record<Station, Info["scoutId"]> = {
  BLUE_1: "Blue 1",
  BLUE_2: "Blue 2",
  BLUE_3: "Blue 3",
  RED_1: "Red 1",
  RED_2: "Red 2",
  RED_3: "Red 3",
};

export const scoutIDToStation: Record<Info["scoutId"], Station> = {
  "Blue 1": "BLUE_1",
  "Blue 2": "BLUE_2",
  "Blue 3": "BLUE_3",
  "Red 1": "RED_1",
  "Red 2": "RED_2",
  "Red 3": "RED_3",
};
