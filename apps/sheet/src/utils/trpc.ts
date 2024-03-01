import type { AppRouter } from "@griffins-scout/api";
import { createTRPCProxyClient, httpLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: "http://localhost:8080/trpc",
    }),
  ],
  transformer: superjson,
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
