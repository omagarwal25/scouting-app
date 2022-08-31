import "dotenv/config";

import express from "express";
import trpcExpress from "@trpc/server/adapters/express/dist/trpc-server-adapters-express.cjs.js";
import { expressHandler } from "trpc-playground/handlers/express";

import cors from "cors";

import { createContext, createRouter } from "./context.js";
import { recordRouter } from "./router/record.js";
import { matchRouter } from "./router/match.js";
import { env } from "./utils/env.js";

export type { Record, Match, MatchType, Team } from "@prisma/client";

const appRouter = createRouter()
  .merge("record.", recordRouter)
  .merge("match.", matchRouter);
// .merge("blueAlliance.", blueAllianceRouter);

export type AppRouter = typeof appRouter;

const trpcEndpoint = "/trpc";
const trpcPlaygroundEndpoint = "/trpc-playground";
const main = async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(
    trpcEndpoint,
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  app.use(
    trpcPlaygroundEndpoint,
    await expressHandler({
      trpcApiEndpoint: trpcEndpoint,
      playgroundEndpoint: trpcPlaygroundEndpoint,
      router: appRouter,
      request: {
        superjson: true,
      },
    })
  );

  app.get("/", (req, res) => res.send("Express + Prisma + tRPC + tRPC Shield"));

  app.listen(env.PORT, () => {
    console.log(`server listening at http://localhost:${env.PORT}`);
    console.log(
      `tRPC playground listening at http://localhost:${env.PORT}${trpcPlaygroundEndpoint}`
    );
  });
};

main();
