import { RecordModel } from "../../prisma/zod/record";
import { z } from "zod";
import { createRouter } from "../context";

export const recordRouter = createRouter()
  .query("findById", {
    input: z.number().nonnegative().int(),
    async resolve({ ctx, input }) {
      return ctx.prisma.record.findUnique({ where: { id: input } });
    },
  })
  .mutation("updateOne", {
    input: RecordModel.partial().merge(
      z.object({ id: z.number().nonnegative().int() })
    ),
    async resolve({ ctx, input }) {
      const { id, ...rest } = input;

      return ctx.prisma.record.update({
        where: { id },
        data: rest,
      });
    },
  })
  .query("findByGameKeyAndTeam", {
    input: z.object({
      gameKey: z.string(),
      team: z.number(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.record.findFirst({
        where: {
          Game: { key: input.gameKey },
          Team: { number: input.team },
        },
      });
    },
  });

export type RecordRouter = typeof recordRouter;
