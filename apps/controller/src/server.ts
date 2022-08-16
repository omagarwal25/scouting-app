import { matchRouter } from "./router/match";
import trpcExpress from "@trpc/server/adapters/express";
import { expressHandler } from "trpc-playground/handlers/express";
import { envsafe, port, str, url } from "envsafe";
import express from "express";
import { createContext, createRouter } from "./context";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { recordRouter } from "./router/record";
import { env } from "./utils/env";

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

  console.log(`Connecting to database... @ ${env.DATABASE_URL}`);
  await mongoose.connect(env.DATABASE_URL, {
    family: 4,
  });
  console.log("Connected to database.");
  app.listen(env.PORT, () => {
    console.log(`server listening at http://localhost:${env.PORT}`);
    console.log(
      `tRPC playground listening at http://localhost:${env.PORT}${trpcPlaygroundEndpoint}`
    );
  });
};

main();
