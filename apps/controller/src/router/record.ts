import { gameSchema } from "@griffins-scout/game";
import { z } from "zod";
import { createRouter } from "../context";

export const recordRouter = createRouter()
  .mutation("createRecord", {
    input: gameSchema,
    async resolve({ input, ctx: { prisma } }) {
      const teamNumber = input.info.teamNumber;
      const record = prisma.record.create({
        data: {
          data: input,
          team: {
            connectOrCreate: {
              where: { teamNumber },
              create: { teamNumber, weight: 0, name: "None" },
            },
          },
        },
      });

      return record;
    },
  })
  .query("findAll", {
    async resolve({ ctx: { prisma } }) {
      return await prisma.record.findMany();
    },
  })
  .mutation("deleteAll", {
    async resolve({ ctx: { prisma } }) {
      await prisma.record.deleteMany();
    },
  })
  .query("findByTeam", {
    input: z.number().nonnegative().int(),
    async resolve({ input, ctx: { prisma } }) {
      return prisma.record.findMany({ where: { teamNumber: input } });
    },
  });
