import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { expressHandler } from "trpc-playground/handlers/express";
import { createContext } from "./context.js";
import { TBAMatch } from "./interfaces/match.js";
import { blueAllianceRouter } from "./router/blueAlliance.js";
import { objectiveRouter } from "./router/objective.js";
import { pitRouter } from "./router/pit.js";
import { recordRouter } from "./router/record.js";
import { subjectiveRouter } from "./router/subjective.js";
import { router } from "./trpc.js";
import { env } from "./utils/env.js";

const appRouter = router({
  record: recordRouter,
  blueAlliance: blueAllianceRouter,
  objective: objectiveRouter,
  subjective: subjectiveRouter,
  pit: pitRouter,
});

export type AppRouter = typeof appRouter;
export type { TBAMatch };

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
