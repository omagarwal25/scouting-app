import { getGames } from "../store";

const allGames = await getGames();

export default () => {
  return <pre>{JSON.stringify(allGames)}</pre>;
};
