import { createGameApi } from "./game";
import { createTeamApi } from "./team";

export * from "./game";
export * from "./team";

export interface Instance {
  baseUrl: string;
}

export const createInstance = (baseUrl: string): Instance => {
  return {
    baseUrl,
  };
};

export const createApi = (instance: Instance) => ({
  game: createGameApi(instance),
  team: createTeamApi(instance),
});

export type Api = ReturnType<typeof createApi>;
