import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./context";
import { logErrorWithHeading, logInfo, logInfoWithHeading } from "@griffins-scout/logger";

const t = initTRPC.context<Context>().create({
  // Optional:
  transformer: superjson,
  // Optional:
  errorFormatter({ shape }) {
    return {
      ...shape,
      data: {
        ...shape.data,
      },
    };
  },
});

const logger = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  result.ok
    ? logInfoWithHeading(`${type} ${path}`, `OK request timing: ${durationMs}ms`,)
    : logErrorWithHeading(`${type} ${path}`, `Error request timing: ${durationMs}ms ${result.error}`)

  return result;
});

export const router = t.router;
export const mergeRouters = t.mergeRouters;
export const publicProcedure = t.procedure.use(logger);
