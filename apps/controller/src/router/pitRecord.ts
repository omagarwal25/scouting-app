import { z } from "zod";
import { createRouter } from "../context";

export const pitRecordRouter = createRouter()
  .query("findAll", {
    async resolve({ ctx: { prisma } }) {
      return await prisma.pitRecord.findMany({
        include: { team: true },
      });
    },
  })
  .query("findByTeamNumber", {
    input: z.number().nonnegative().int(),
    async resolve({ input, ctx: { prisma } }) {
      return await prisma.pitRecord.findMany({
        where: { team: { number: input } },
        include: { team: true },
      });
    },
  });
