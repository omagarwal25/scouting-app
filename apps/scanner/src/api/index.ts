import type { AppRouter } from '@griffins-scout/api';
import { createTRPCClient } from '@trpc/client';

export const client = createTRPCClient<AppRouter>({
  url: 'http://localhost:8080/trpc',
});
