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
import { scoringCardFactory } from '~/components/input/ScoringCard';
import {
  autoKeys,
  autoSchema,
  endgameKeys,
  endgameSchema,
  infoKeys,
  infoSchema,
  postgameKeys,
  postgameSchema,
  pregameKeys,
  pregameSchema,
  teleopKeys,
  teleopSchema,
} from '~/models';
import { PreviewCard, QRCodeCard, RootScreen, ScannerCard } from '~/screens';
import NotFoundScreen from '~/screens/NotFoundScreen';
import {
  autoAtom,
  endgameAtom,
  infoAtom,
  postgameAtom,
  pregameAtom,
  teleopAtom,
} from '~/state';
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
  const scoringCards: {
    factory: ReturnType<typeof scoringCardFactory>;
    name: keyof RootStackParamList;
  }[] = [
    {
      name: 'Info',
      factory: scoringCardFactory({
        atom: infoAtom,
        keys: infoKeys,
        nextPage: 'Pregame',
        zodSchema: infoSchema,
      }),
    },
    {
      name: 'Pregame',
      factory: scoringCardFactory({
        atom: pregameAtom,
        keys: pregameKeys,
        nextPage: 'Auto',
        zodSchema: pregameSchema,
      }),
    },
    {
      name: 'Auto',
      factory: scoringCardFactory({
        atom: autoAtom,
        keys: autoKeys,
        nextPage: 'Teleop',
        zodSchema: autoSchema,
      }),
    },
    {
      name: 'Teleop',
      factory: scoringCardFactory({
        atom: teleopAtom,
        keys: teleopKeys,
        nextPage: 'Endgame',
        zodSchema: teleopSchema,
      }),
    },
    {
      name: 'Endgame',
      factory: scoringCardFactory({
        atom: endgameAtom,
        keys: endgameKeys,
        nextPage: 'Postgame',
        zodSchema: endgameSchema,
      }),
    },
    {
      name: 'Postgame',
      factory: scoringCardFactory({
        atom: postgameAtom,
        keys: postgameKeys,
        nextPage: 'Preview',
        zodSchema: postgameSchema,
      }),
    },
  ];

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
        <Stack.Screen name="Preview" component={PreviewCard} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
