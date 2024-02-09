import { getMatches } from "./utils/blueAlliance.js";
import { client } from "./utils/trpc.js";
import { TBAMatch } from "@griffins-scout/api";

const main = async () => {
  // every 5 min
  // thats 300000 ms
  setInterval(async () => {
    const matches = await getMatches();

    // chunk the arrays into groups of 100
    const chunked: TBAMatch[][] = [];

    while (matches.length > 0) {
      chunked.push(matches.splice(0, 25));
    }

    console.log("Fetching...");
    console.log("m", chunked);
    await client.blueAlliance.deleteAll.mutate();

    for (const chunk of chunked) {
      await client.blueAlliance.importFromTba.mutate(chunk);
    }
  }, 5 * 60 * 1000);
};

main();
