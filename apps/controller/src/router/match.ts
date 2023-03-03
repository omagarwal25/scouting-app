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
  findByTypeAndNumber: publicProcedure
    .input(
      z.object({
        type: z.enum([
          "PRACTICE",
          "QUALIFICATION",
          "QUARTERFINAL",
          "SEMIFINAL",
          "FINAL",
        ]),

        number: z.number().nonnegative().int(),
      })
    )
    .query(async () => {}),
  deleteAll: publicProcedure.mutation(async () => {}),
  importFromTba: publicProcedure.mutation(async () => {
    const matches = await getMatches();

    await addMatches(await getAuthToken(), matches);
  }),
});
