import { infoMatchTypeToMatchType } from "@griffins-scout/api";
import { gameSchema } from "@griffins-scout/game";
import { z } from "zod";
import { createRouter } from "../context.js";

export const recordRouter = createRouter()
  .mutation("createRecord", {
    input: gameSchema,
    async resolve({ input, ctx: { prisma } }) {
      // see if match exists
      const matchType = infoMatchTypeToMatchType(input.info.matchType);
      const matchNumber = input.info.matchNumber;

      const match = await prisma.match.findUnique({
        where: { number_type: { type: matchType, number: matchNumber } },
      });

      const teamNumber = input.info.teamNumber;
      const record = await prisma.record.create({
        data: {
          data: input,
          team: {
            connectOrCreate: {
              where: { number: teamNumber },
              create: { number: teamNumber, weight: 0, name: "None" },
            },
          },
        },
      });

      if (match) {
        return await prisma.record.update({
          where: { id: record.id },
          data: { matchId: match?.id },
        });
      }

      return record;
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.number(),
      data: gameSchema,
    }),
    async resolve({ input, ctx: { prisma } }) {
      const matchType = infoMatchTypeToMatchType(input.data.info.matchType);
      const matchNumber = input.data.info.matchNumber;

      const match = await prisma.match.findUnique({
        where: { number_type: { type: matchType, number: matchNumber } },
      });

      const teamNumber = input.data.info.teamNumber;
      const record = await prisma.record.update({
        where: { id: input.id },
        data: {
          data: input,
          team: {
            connectOrCreate: {
              where: { number: teamNumber },
              create: { number: teamNumber, weight: 0, name: "None" },
            },
          },
        },
      });

      if (match) {
        return await prisma.record.update({
          where: { id: record.id },
          data: { matchId: match?.id },
        });
      }

      return record;
    },
  })
  .query("findAll", {
    async resolve({ ctx: { prisma } }) {
      return await prisma.record.findMany({
        include: { team: true, match: true },
      });
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
