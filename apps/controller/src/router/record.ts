import { objectiveRecordSchema, pitRecordSchema } from "@griffins-scout/game";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";

export const recordRouter = router({
  createRecord: publicProcedure
    .input(
      z.array(
        z
          .object({
            type: z.literal("objective"),
            record: objectiveRecordSchema,
          })
          .or(
            z.object({
              type: z.literal("pit"),
              record: pitRecordSchema,
            })
          )
      )
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const obj = input
        .filter((i) => i.type === "objective")
        .map((i) => i.record)
        .map((i) => ({
          content: i,
        }));

      const pit = input
        .filter((i) => i.type === "pit")
        .map((i) => i.record)
        .map((i) => ({ content: i }));

      await db.objectiveRecord.createMany({
        data: obj,
      });

      await db.pitRecord.createMany({
        data: pit,
      });
    }),
});
