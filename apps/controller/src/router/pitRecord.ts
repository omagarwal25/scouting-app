import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const pitRecordRouter = router({
  findAll: publicProcedure.query(async ({ ctx: { prisma } }) => {
    return await prisma.pitRecord.findMany({
      include: { team: true },
    });
  }),
  findByTeamNumber: publicProcedure
    .input(z.number().nonnegative().int())
    .query(async ({ input, ctx: { prisma } }) => {
      return await prisma.pitRecord.findMany({
        where: { team: { number: input } },
        include: { team: true },
      });
    }),
});
