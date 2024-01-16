import { z } from "zod";
import { TBAMatch } from "../server.js";

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
//

export const blueAllianceRouter = router({
  findAll: publicProcedure.query(async ({ ctx: { db } }) => {
    // return await getMatches();
    return (await db.tBARecord.findMany()) as unknown as {
      content: TBAMatch;
      id: string;
    }[];
  }),

  importFromTba: publicProcedure
    .input(z.array(z.any()))
    .mutation(async ({ input, ctx: { db } }) => {
      console.log(input);
      await db.tBARecord.createMany({
        data: input.map((match) => ({
          content: match,
        })),
      });
    }),

  deleteAll: publicProcedure.mutation(async ({ ctx: { db } }) => {
    await db.tBARecord.deleteMany();
  }),
});
