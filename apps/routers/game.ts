import { z } from "zod";
import { createRouter } from "../controller/src/context";

export const gameRouter = createRouter()
  .query("findAll", {
    async resolve({ ctx }) {
      return ctx.prisma.game.findMany();
    },
  })
  .query("findByKey", {
    input: z.string(),
    async resolve({ ctx, input }) {
      return ctx.prisma.game.findUnique({ where: { key: input } });
    },
  });

export type GameRouter = typeof gameRouter;
