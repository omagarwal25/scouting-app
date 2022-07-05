import * as trpcExpress from "@trpc/server/adapters/express";
import { envsafe, port, str, url } from "envsafe";
import express from "express";
import { createContext, createRouter } from "./context";
import { blueAllianceRouter } from "./routers/blueAlliance";
import { gameRouter } from "./routers/game";
import cors from "cors";
import { recordRouter } from "./routers/record";

export type { Game, Record, Team, Station, GameType } from "@prisma/client";

export const env = envsafe({
  NODE_ENV: str({
    devDefault: "development",
    choices: ["development", "test", "production"],
  }),
  PORT: port({
    devDefault: 8080,
  }),
  X_TBA_AUTH_KEY: str(),
  DATABASE_URL: url(),
  EVENT_CODE: str(),
});

const app = express();

const appRouter = createRouter()
  .merge("game.", gameRouter)
  .merge("record.", recordRouter)
  .merge("blueAlliance.", blueAllianceRouter);

export type AppRouter = typeof appRouter;

app.use(cors());
app.use(express.json());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.get("/", (req, res) => res.send("Express + Prisma + tRPC + tRPC Shield"));

app.listen(env.PORT, () => {
  console.log(`server listening at http://localhost:${env.PORT}`);
});
