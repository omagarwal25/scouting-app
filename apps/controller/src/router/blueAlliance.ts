import { z } from "zod";
import { TBAMatch } from "../server.js";

import { publicProcedure, router } from "../trpc.js";
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
      await db.tBARecord.createMany({
        data: input.map((match) => ({
          content: match,
        })),
      });
    }),

  findAllClean: publicProcedure.query(async ({ ctx: { db } }) => {
    return (await db.tBARecord.findMany()).map((record) => record.content as unknown as TBAMatch).map(m => ({
      key: m.key, comp_level: m.comp_level, match_number: m.match_number, set_number: m.set_number
    }));
  }),

  deleteAll: publicProcedure.mutation(async ({ ctx: { db } }) => {
    await db.tBARecord.deleteMany();
  }),
});
