import type { AppRouter } from '@griffins-scout/api';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
