import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorSchemeName } from 'react-native';
import { QRCodeCard, RootScreen, ScannerCard } from '~/screens';
import { scoringCards } from '~/screens/Modals';
import { NotFoundScreen } from '~/screens/NotFoundScreen';
import { RootStackParamList } from '~/types';
import { linking as LinkingConfiguration } from './LinkingConfiguration';

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
        {scoringCards.map(([component, name]) => (
          <Stack.Screen key={name} name={name} component={component} />
        ))}
        <Stack.Screen name="QR" component={QRCodeCard} />
        <Stack.Screen name="Scanner" component={ScannerCard} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
