import { Instance } from ".";

export interface Team {
  number: number;
  name: string;
  weight: number;
}

export interface TeamQuery {
  number: number;
}

const getAll =
  (instance: Instance) =>
  async (query?: { name?: string; number?: number }): Promise<Team> => {
    if (!query) {
      const res = await fetch(`${instance.baseUrl}/teams`);
      return await res.json();
    }

    // turn the query into a query string if they exist
    const queryString = Object.keys(query)
      .map((key) => `${key}=${query[key as keyof typeof query]}`)
      .join("&");

    const res = await fetch(`${instance.baseUrl}/teams?${queryString}`);
    return await res.json();
  };

const getOne =
  (instance: Instance) =>
  async (query: TeamQuery): Promise<Team> => {
    const res = await fetch(`${instance.baseUrl}/teams/${query.number}`);
    return await res.json();
  };

const post =
  (instance: Instance) =>
  async (team: Team): Promise<void> => {
    const res = await fetch(`${instance.baseUrl}/teams/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(team),
    });
    return await res.json();
  };

const patch =
  (instance: Instance) =>
  async (query: TeamQuery, team: Partial<Team>): Promise<void> => {
    const res = await fetch(`${instance.baseUrl}/teams/${query.number}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(team),
    });
    return await res.json();
  };

const deleteOne =
  (instance: Instance) =>
  async (query: TeamQuery): Promise<void> => {
    const res = await fetch(`${instance.baseUrl}/teams/${query.number}`, {
      method: "DELETE",
    });
    return await res.json();
  };

export const createTeamApi = (instance: Instance) => ({
  getAll: getAll(instance),
  getOne: getOne(instance),
  post: post(instance),
  patch: patch(instance),
  deleteOne: deleteOne(instance),
});

export type TeamApi = ReturnType<typeof createTeamApi>;
