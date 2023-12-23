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

export const blueAllianceRouter = router({
  findAll: publicProcedure.query(async ({ ctx: { db } }) => {
    // return await getMatches();
    return db.tBARecord.findMany();
  }),

  importFromTba: publicProcedure.mutation(async () => {
    const matches = await getMatches();

    await addMatches(await getAuthToken(), matches);
  }),
});
