import { Game } from "scouting-app-game";
import { Store } from "tauri-plugin-store-api";

// returns the store instance
export const getStore = () => new Store(".data");

export const init = async () => {
  const store = getStore();

  if (!(await store.has("games"))) {
    await store.set("games", []);
  }

  console.log(store.path);
};

export const addGame = async (game: Game) => {
  const store = getStore();
  const games: Game[] = (await store.get("games")) as Game[];
  games.push(game);
  await store.set("games", games);
};

export const getGames = async () => {
  const store = getStore();
  return (await store.get("games")) as Game[];
};

export const getLatestEntry = async () => {
  const store = getStore();
  const games: Game[] = (await store.get("games")) as Game[];
  return games[games.length - 1];
};

export const deleteLatestEntry = async () => {
  const store = getStore();
  const games: Game[] = (await store.get("games")) as Game[];
  games.pop();
  await store.set("games", games);
};
