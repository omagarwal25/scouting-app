import { createTRPCClient } from "@trpc/client";
import { createResource } from "solid-js";

import type { inferHandlerInput } from "@trpc/server";
import type { AppRouter } from "@griffins-scout/api";

const client = createTRPCClient<AppRouter>({ url: "/api/trpc" });

type AppQueries = AppRouter["_def"]["queries"];

type AppQueryKeys = keyof AppQueries & string;

export const createTrpcQuery = <TPath extends AppQueryKeys>(
  path: TPath,
  ...args: inferHandlerInput<AppQueries[TPath]>
) => {
  const fetchData = async () => {
    return client.query(path, ...args);
  };

  return createResource(fetchData);
};