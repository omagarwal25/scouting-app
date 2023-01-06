import { z } from "zod";

import { createRouter } from "../context.js";
import {
  compLevelToMatchType,
  getMatches,
  getTeam,
  matchToMatchLevel,
  teamKeyToNumber,
} from "../utils/blueAlliance.js";

export const matchRouter = createRouter()
  .query("findAll", {
    async resolve({ ctx: { prisma } }) {
      return await prisma.match.findMany({
        include: { blueTeams: true, redTeams: true },
      });
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
  })
  .mutation("importFromTBA", {
    // TODO think about if we want to pass in the event code here instead of being an env
    async resolve({ ctx: { prisma } }) {
      // delete all matches and teams
      await prisma.match.deleteMany();
      await prisma.team.deleteMany();

      console.log("ello");

      const matches = (await getMatches()).map((match) => ({
        number: matchToMatchLevel(match),
        type: compLevelToMatchType(match.comp_level),
        blueAlliance: match.alliances.blue.team_keys.map(teamKeyToNumber),
        redAlliance: match.alliances.red.team_keys.map(teamKeyToNumber),
      }));

      console.log(await getMatches());

      // flat map then dedupe
      const teams = matches
        .flatMap((match) => [...match.redAlliance, ...match.blueAlliance])
        .filter(
          (teamNumber, index, self) => self.indexOf(teamNumber) === index
        );

      const dbTeams = teams.map(async (teamNumber) => {
        const team = await getTeam(teamNumber);
        return prisma.team.create({
          data: {
            name: team.nickname,
            number: teamNumber,
          },
        });
      });

      await Promise.all(dbTeams);

      const rows = matches.map(async (match) =>
        prisma.match.create({
          data: {
            type: match.type,
            number: match.number,
            blueTeams: {
              connect: match.blueAlliance.map((t) => ({ number: t })),
            },
            redTeams: {
              connect: match.redAlliance.map((t) => ({ number: t })),
            },
          },
        })
      );

      await Promise.all(rows);
    },
  });
