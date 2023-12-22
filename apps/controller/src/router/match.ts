import { z } from "zod";

import { publicProcedure, router } from "../trpc.js";
import { getMatches } from "../utils/blueAlliance.js";
import { addMatches, getAuthToken } from "../utils/sheet.js";
// import {
//   compLevelToMatchType,
//   getMatches,
//   getTeam,
//   matchToMatchLevel,
//   teamKeyToNumber,
// } from "../utils/blueAlliance.js";

export const matchRouter = router({
  findAll: publicProcedure.query(async () => {
    return await getMatches();
  }),


  importFromTba: publicProcedure.mutation(async () => {
    const matches = await getMatches();

    await addMatches(await getAuthToken(), matches);
  }),
});
