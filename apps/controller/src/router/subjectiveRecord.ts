import { z } from "zod";
import { createRouter } from "../context";

export const subjectiveRecordRouter = createRouter()
  .query("findAll", {
    async resolve({ ctx: { prisma } }) {
      return await prisma.subjectiveRecord.findMany({
        include: { team: true, match: true },
      });
    },
  })
  .query("findByTeam", {
    input: z.number().nonnegative().int(),
    async resolve({ input, ctx: { prisma } }) {
      return await prisma.subjectiveRecord.findMany({
        where: { team: { number: input } },
        include: { team: true, match: true },
      });
    },
  })
  .query("findByMatch", {
    input: z.object({
      type: z.enum([
        "PRACTICE",
        "QUALIFICATION",
        "QUARTERFINAL",
        "SEMIFINAL",
        "FINAL",
      ]),
      number: z.number().nonnegative().int(),
    }),
    async resolve({ input, ctx: { prisma } }) {
      return await prisma.subjectiveRecord.findMany({
        where: {
          match: {
            number: input.number,
            type: input.type,
          },
        },
        include: { team: true, match: true },
      });
    },
  });