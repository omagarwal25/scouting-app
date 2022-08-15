import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDeviceContext } from 'twrnc';
import { Text } from 'react-native';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import tw from './utils/tailwind';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useDeviceContext(tw);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Suspense
          fallback={<Text style={tw`dark:text-white`}>Loading...</Text>}
        >
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </Suspense>
      </SafeAreaProvider>
    );
  }
}
