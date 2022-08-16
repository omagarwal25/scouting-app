import { z } from "zod";
import { createRouter } from "../context";

export const matchRouter = createRouter()
  .query("findAll", {
    async resolve({ ctx: { prisma } }) {
      return await prisma.match.findMany();
    },
  })
  .query("findByTypeAndNumber", {
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
      return prisma.match.findMany({
        where: input,
      });
    },
  })
  .mutation("deleteAll", {
    async resolve({ ctx: { prisma } }) {
      await prisma.match.deleteMany();
    },
  });

// .query("findByTypeAndNumber", {
//   input: {},
//   async resolve({ input, ctx: { prisma } }) {
//     return prisma.match.findMany({
//       // where: { type: input.type, number: input.number },
//     });
//   },
// });
