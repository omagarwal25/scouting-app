/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ColorSchemeName } from 'react-native';

import {
  AutoCard,
  EndgameCard,
  InfoCard,
  PostgameCard,
  PregameCard,
  PreviewCard,
  QRCodeCard,
  RootScreen,
  ScannerCard,
  TeleopCard,
} from '~/screens';
import NotFoundScreen from '~/screens/NotFoundScreen';

import { RootStackParamList } from '~/types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({
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
        <Stack.Screen name="Info" component={InfoCard} />
        <Stack.Screen name="Pregame" component={PregameCard} />
        <Stack.Screen name="Auto" component={AutoCard} />
        <Stack.Screen name="Teleop" component={TeleopCard} />
        <Stack.Screen name="Endgame" component={EndgameCard} />
        <Stack.Screen name="Postgame" component={PostgameCard} />
        <Stack.Screen name="QR" component={QRCodeCard} />
        <Stack.Screen name="Scanner" component={ScannerCard} />
        <Stack.Screen name="Preview" component={PreviewCard} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
