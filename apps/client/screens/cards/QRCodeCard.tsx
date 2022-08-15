import { View } from 'react-native';

// import { gameAtom, saveGameAtom } from '~/state';
import QRCode from 'react-native-qrcode-svg';
import { encodeGame } from '@griffins-scout/game';
import { useAtom } from 'jotai';
import layout from '~/constants/Layout';
import { Topbar } from '~/components/Topbar';
import { RootTabScreenProps } from '~/types';
import { Button } from '~/components/Button';
import useColorScheme from '~/hooks/useColorScheme';
import Colors from '~/constants/Colors';
import { gameAtom } from '~/state';
import { Alert } from 'react-native';
import { Container } from '~/components/Container';
import tw from '~/utils/tailwind';

export function QRCodeCard({ navigation }: RootTabScreenProps) {
  const [game] = useAtom(gameAtom);
  const colorScheme = useColorScheme();
  // const [_, saveGame] = useAtom(saveGameAtom);

  const createAlert = () =>
    Alert.alert(
      'Confirm Back?',
      'By going back, your data for this match will be lost.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: () => navigation.navigate('Root'),
        },
      ]
    );

  return (
    <>
      <Topbar />
      <Container>
        <QRCode
          value={encodeGame(game)}
          // value={JSON.stringify(game.gameInfo)}
          size={layout.window.width * 0.9}
          ecl="L"
          {...(colorScheme === 'dark'
            ? { color: Colors['dark'].tint, backgroundColor: 'black' }
            : { color: Colors['light'].tint })}
        />

        <View style={tw`p-0.5`} />

        <Button onPress={() => createAlert()} label="Go Home!" />
      </Container>
    </>
  );
}
