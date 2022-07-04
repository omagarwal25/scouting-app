import { router } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { Context, createContext } from "./context";
import { gameRouter } from "./game";
import { recordRouter } from "./record";

export type { Game, Record, Team, Station, GameType } from "@prisma/client";

const PORT = 8080;

const app = express();

export const createRouter = () => router<Context>();

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
