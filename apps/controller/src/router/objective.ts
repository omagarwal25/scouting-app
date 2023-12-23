import { objectiveRecordSchema } from "@griffins-scout/game";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";

export const objectiveRouter = router({
  findAll: publicProcedure.query(async ({ ctx: { db } }) => {
    return db.tBARecord.findMany();
  }),

  create: publicProcedure
    .input(objectiveRecordSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      await db.subjectiveRecord.create({
        data: { content: input },
      });
    }),

  createMany: publicProcedure
    .input(z.array(objectiveRecordSchema))
    .mutation(async ({ input, ctx: { db } }) => {
      await db.subjectiveRecord.createMany({
        data: {
          content: input,
        },
      });
    }),

  deleteOne: publicProcedure
    .input(z.string().cuid())
    .mutation(async ({ input, ctx: { db } }) => {
      await db.subjectiveRecord.delete({ where: { id: input } });
    }),

  deleteAll: publicProcedure.mutation(async ({ ctx: { db } }) => {
    await db.subjectiveRecord.deleteMany({});
  }),
});
