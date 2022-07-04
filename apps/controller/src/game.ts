import { createRouter } from "./context";

export const gameRouter = createRouter().query("findAll", {
  async resolve({ ctx }) {
    return ctx.prisma.game.findMany();
  },
});

export type GameRouter = typeof gameRouter;
