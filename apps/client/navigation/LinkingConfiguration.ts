/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '~/types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: 'one',
            },
          },
        },
      },
      Auto: 'Auto',
      Endgame: 'Endgame',
      Info: 'Info',
      Postgame: 'Postgame',
      Pregame: 'Pregame',
      Preview: 'Preview',
      QR: 'QR',
      Scanner: 'Scanner',
      Teleop: 'Teleop',

      NotFound: '*',
    },
  },
};

export default linking;
