import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { Context, createContext, createRouter } from "./context";
import { gameRouter } from "./routers/game";
import { recordRouter } from "./routers/record";

export type { Game, Record, Team, Station, GameType } from "@prisma/client";

const PORT = 8080;

const app = express();

const appRouter = createRouter()
  .merge("game.", gameRouter)
  .merge("record.", recordRouter);

export type AppRouter = typeof appRouter;

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.get("/", (req, res) => res.send("Express + Prisma + tRPC + tRPC Shield"));

app.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`);
});
