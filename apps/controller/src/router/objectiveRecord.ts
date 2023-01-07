import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const objectiveRecordRouter = router({
  findAll: publicProcedure.query(async ({ ctx: { prisma } }) => {
    return prisma.objectiveRecord.findMany({
      include: { team: true, match: true },
    });
  }),
  findByTeam: publicProcedure
    .input(z.number().nonnegative().int())
    .query(async ({ input, ctx: { prisma } }) => {
      return await prisma.objectiveRecord.findMany({
        where: { team: { number: input } },
        include: { team: true, match: true },
      });
    }),
  findByMatch: publicProcedure
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
    .query(async ({ input, ctx: { prisma } }) => {
      return await prisma.objectiveRecord.findMany({
        where: {
          match: {
            number: input.number,
            type: input.type,
          },
        },
        include: { team: true, match: true },
      });
    }),
});
