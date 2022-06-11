import { Instance } from ".";
import type { Game, Info } from "@griffins-scout/game";

export interface GameRecord {
  teamNumber: number;
  data: string[];
  station: Station;
}

export type Station =
  | "RED_1"
  | "RED_2"
  | "RED_3"
  | "BLUE_1"
  | "BLUE_2"
  | "BLUE_3";

export const stationToScoutId: Record<Station, Info["scoutId"]> = {
  RED_1: "Red 1",
  RED_2: "Red 2",
  RED_3: "Red 3",
  BLUE_1: "Blue 1",
  BLUE_2: "Blue 2",
  BLUE_3: "Blue 3",
};

export const scoutIdToStation: Record<Info["scoutId"], Station> = {
  "Red 1": "RED_1",
  "Red 2": "RED_2",
  "Red 3": "RED_3",
  "Blue 1": "BLUE_1",
  "Blue 2": "BLUE_2",
  "Blue 3": "BLUE_3",
};

export interface DBGame {
  time: Date;
  type: "PRACTICE" | "QUALIFYING" | "PLAYOFF";
  number: number;
  records: GameRecord[];
}

export interface GameQuery {
  type: "PRACTICE" | "QUALIFYING" | "PLAYOFF";
  number: number;
}

const getAll = (instance: Instance) => async (): Promise<DBGame[]> => {
  const res = await fetch(`${instance.baseUrl}/games`);
  return await res.json();
};
const getOne =
  (instance: Instance) =>
  async (query: GameQuery): Promise<DBGame> => {
    const res = await fetch(
      `${instance.baseUrl}/games/${query.type}/${query.number}`
    );
    return await res.json();
  };

const post =
  (instance: Instance) =>
  async (game: DBGame): Promise<void> => {
    const res = await fetch(`${instance.baseUrl}/games/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });
    return await res.json();
  };

const put =
  (instance: Instance) =>
  async (query: GameQuery, game: DBGame): Promise<void> => {
    const res = await fetch(
      `${instance.baseUrl}/games/${query.type}/${query.number}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(game),
      }
    );
    return await res.json();
  };

const deleteOne =
  (instance: Instance) =>
  async (query: GameQuery): Promise<void> => {
    const res = await fetch(
      `${instance.baseUrl}/games/${query.type}/${query.number}`,
      {
        method: "DELETE",
      }
    );
    return await res.json();
  };

const postData =
  (instance: Instance) =>
  async (data: Game): Promise<void> => {
    const res = await fetch(
      `${instance.baseUrl}/games/${data.info.matchType.toUpperCase()}/${
        data.info.matchNumber
      }/record/${data.info.teamNumber}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: JSON.stringify(data) }),
      }
    );
    return await res.json();
  };

const postRecord =
  (instance: Instance) =>
  async (query: GameQuery, record: GameRecord): Promise<void> => {
    const res = await fetch(
      `${instance.baseUrl}/games/${query.type}/${query.number}/record`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      }
    );
    return await res.json();
  };

const getGamesByTeam =
  (instance: Instance) =>
  async (query: { teamNumber: number }): Promise<DBGame[]> => {
    const res = await fetch(
      `${instance.baseUrl}/games/team/${query.teamNumber}`
    );
    return await res.json();
  };

export const createGameApi = (instance: Instance) => ({
  getAll: getAll(instance),
  getOne: getOne(instance),
  post: post(instance),
  put: put(instance),
  deleteOne: deleteOne(instance),
  postData: postData(instance),
  postRecord: postRecord(instance),
  getGamesByTeam: getGamesByTeam(instance),
});

export type GameApi = ReturnType<typeof createGameApi>;
