import type { AppRouter } from '@griffins-scout/api';
import { createTRPCClient } from '@trpc/client';
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import superjson from 'superjson';

export const client = createTRPCClient<AppRouter>({
  url: 'http://localhost:8080/trpc',
  transformer: superjson,
});

export type inferQueryOutput<
  TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>;

export type inferQueryInput<
  TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureInput<AppRouter['_def']['queries'][TRouteKey]>;

export type inferMutationOutput<
  TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>;

export type inferMutationInput<
  TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>;
