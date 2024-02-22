import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { StatusBar } from 'expo-status-bar';
import { useAtom } from 'jotai';
import { Suspense, useState } from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import superjson from 'superjson';
import { useDeviceContext } from 'twrnc';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { appSettingsAtom } from './state';
import tw from './utils/tailwind';
import { trpc } from './utils/trpc';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [settings] = useAtom(appSettingsAtom);

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `http://192.168.195.101:8080/trpc`,
        }),
      ],
      transformer: superjson,
    })
  );

  useDeviceContext(tw);

  if (!isLoadingComplete) {
    return <Text style={tw`dark:text-white`}>Loading ...</Text>;
  } else {
    return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <Suspense
              fallback={<Text style={tw`dark:text-white`}>Loading...</Text>}
            >
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </Suspense>
          </SafeAreaProvider>
        </QueryClientProvider>
      </trpc.Provider>
    );
  }
}
