/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorSchemeName } from 'react-native';
import { QRCodeCard, RootScreen, ScannerCard } from '~/screens';
import { scoringCards } from '~/screens/Modals';
import NotFoundScreen from '~/screens/NotFoundScreen';
import { RootStackParamList } from '~/types';
import LinkingConfiguration from './LinkingConfiguration';

export default function avigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={RootScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        {scoringCards.map((e) => (
          <Stack.Screen key={e.name} name={e.name} component={e.factory} />
        ))}
        <Stack.Screen name="QR" component={QRCodeCard} />
        <Stack.Screen name="Scanner" component={ScannerCard} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
