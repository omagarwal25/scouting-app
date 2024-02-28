import { TBAMatch } from "@griffins-scout/api";
import {
  changeableLog,
  infoMessage,
  intervalWithBar,
} from "@griffins-scout/logger";
import { getMatches } from "./utils/blueAlliance.js";
import { client } from "./utils/trpc.js";

const main = async () => {
  // every 5 min
  // thats 300000 ms

  await update();

  intervalWithBar(async () => {
    await update();
  }, 5 * 60 * 1000);
};

async function update() {
  const matchImportStatus = changeableLog(
    infoMessage(`Importing matches from TBA...`)
  );

  const matches = await getMatches();

  matchImportStatus.update(infoMessage(`Importing matches from TBA... Done!`));
  matchImportStatus.end();

  // chunk the arrays into groups of 100
  const chunked: TBAMatch[][] = [];

  while (matches.length > 0) {
    chunked.push(matches.splice(0, 25));
  }

  const deleteStatus = changeableLog(infoMessage(`Deleting all matches...`));

  await client.blueAlliance.deleteAll.mutate();

  deleteStatus.update(infoMessage(`Deleting all matches... Done!`));
  deleteStatus.end();

  const importStatus = changeableLog(infoMessage(`Importing matches...`));

  for (const chunk of chunked) {
    await client.blueAlliance.importFromTba.mutate(chunk);
  }

  importStatus.update(infoMessage(`Importing matches... Done!`));
  importStatus.end();
}

main();
