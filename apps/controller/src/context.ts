import superjson from "superjson";
import * as trpc from "@trpc/server";

export const createContext = () => {};

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
        : console.warn("Non-OK request timing", { path, type, durationMs });

      return result;
    });
}
