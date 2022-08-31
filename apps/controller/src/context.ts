import superjson from "superjson";
import trpc from "@trpc/server";
import { PrismaClient } from "@prisma/client";

export const createContext = () => {
  const prisma = new PrismaClient({
    log: [
      // {
      // emit: "event",
      // level: "query",
      // },
      "info",
      "warn",
      "error",
    ],
  });

  // prisma.$on("query", (e) => {
  //   console.log("Query: " + e.query);
  //   console.log("Duration: " + e.duration + "ms");
  // });

  return { prisma };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export function createRouter() {
  return trpc
    .router<Context>()
    .transformer(superjson)
    .middleware(async ({ path, type, next }) => {
      const start = Date.now();
      const result = await next();
      const durationMs = Date.now() - start;
      result.ok
        ? console.info("OK request timing:", { path, type, durationMs })
        : console.warn("Non-OK request timing", {
            path,
            type,
            durationMs,
            error: result.error,
          });

      return result;
    });
}
