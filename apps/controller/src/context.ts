import { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";

export const createContext = () => {
  const prisma = new PrismaClient({
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
  prisma.$on("query", (e) => {
    console.log("Query: " + e.query);
    console.log("Duration: " + e.duration + "ms");
  });
  return {
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export function createRouter() {
  return trpc.router<Context>();
}
