import { logInfo, logInfoWithHeading } from "@griffins-scout/logger";
import { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";

export const createContext = () => {
  const db = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      "info",
      "warn",
      "error",
    ],
  });

  db.$on("query", (e) => {
    logInfoWithHeading("Query", e.query);
    logInfo("Duration: " + e.duration + "ms");
  });

  return {
    db,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
