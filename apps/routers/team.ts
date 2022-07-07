import { createRouter } from "../context";

export const teamRouter = createRouter().query("findAll", {
  async resolve({ ctx }) {
    return ctx.prisma.team.findMany({
      select: {
        name: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        number: true,
        weight: true,
        Records: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            Game: true,
            data: true,
            station: true,
          },
        },
      },
    });
  },
});

export type TeamRouter = typeof teamRouter;
