import { CompLevel, Match } from "../controller/src/models/match";
import { createRouter } from "../controller/src/context";
import { env, Station } from "../controller/src/server";
import { TBATeam } from "../controller/src/models/team";

const tbaBaseUrl = "https://www.thebluealliance.com/api/v3";
const indexToStation = (index: number, color: "RED" | "BLUE"): Station => {
  if (color === "RED") {
    return (["RED_1", "RED_2", "RED_3"] as const)[index] ?? "RED_3";
  } else {
    return (["BLUE_1", "BLUE_2", "BLUE_3"] as const)[index] ?? "RED_3";
  }
};

export const blueAllianceRouter = createRouter().query("fetch", {
  async resolve({ ctx }) {
    // send request with header
    const res = await fetch(
      `${tbaBaseUrl}/event/${env.EVENT_CODE}/matches/simple`,
      {
        headers: {
          "X-TBA-Auth-Key": env.X_TBA_AUTH_KEY,
          accept: "application/json",
        },
      }
    );

    const games = (await res.json()) as Match[];
    for (const game of games) {
      if (game.comp_level === CompLevel.Qm) {
        const teams: { key: string; station: Station }[] = [
          ...game.alliances.blue.team_keys.map((team, index) => ({
            key: team,
            station: indexToStation(index, "BLUE"),
          })),
          ...game.alliances.red.team_keys.map((team, index) => ({
            key: team,
            station: indexToStation(index, "RED"),
          })),
        ];
        // check if the game exists
        const dbGame = await ctx.prisma.game.findUnique({
          where: { key: game.key },
        });

        if (dbGame === null) {
          const tbaGameTypeToDbGameType = {
            qm: "QUALIFICATION",
            qf: "QUARTER_FINAL",
            sf: "SEMI_FINAL",
            f: "FINAL",
          } as const;

          // create the game
          const newGame = await ctx.prisma.game.create({
            data: {
              key: game.key,
              time: new Date(game.predicted_time * 1000),
              type: tbaGameTypeToDbGameType[game.comp_level],
              number: game.match_number,
            },
          });

          // iterate over the teams
          for (const { key, station } of teams) {
            const strippedTeam = key.replace("frc", "");
            const teamExists = await ctx.prisma.team.findUnique({
              where: { number: Number(strippedTeam) },
            });

            let id = teamExists?.id;

            if (teamExists === null) {
              // grab the team from TBA
              const tbaTeam: TBATeam = await fetch(
                `${tbaBaseUrl}/team/${key}`,
                {
                  headers: {
                    "X-TBA-Auth-Key": env.X_TBA_AUTH_KEY,
                    accept: "application/json",
                  },
                }
              ).then((res) => res.json());

              // create the team
              const dbTeam = await ctx.prisma.team.create({
                data: {
                  number: Number(strippedTeam),
                  name: tbaTeam.nickname,
                  weight: 0,
                },
              });

              id = dbTeam.id;
            }

            // create the team in the game
            await ctx.prisma.record.create({
              data: {
                Team: {
                  connect: {
                    id,
                  },
                },
                Game: {
                  connect: {
                    id: newGame.id,
                  },
                },
                data: [],
                station,
              },
            });
          }
        } else {
          // update the game
          console.log(new Date(game.predicted_time * 1000).toISOString());
          await ctx.prisma.game.update({
            where: { key: game.key },
            data: {
              time: new Date(game.predicted_time * 1000),
            },
          });
        }
      }
    }
  },
});
