import { View } from 'react-native';

// import { gameAtom, saveGameAtom } from '~/state';
import { encodeGame, encodeSubjective } from '@griffins-scout/game';
import { useAtom } from 'jotai';
import { Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ObjectiveTopbar, Topbar } from '~/components/Topbar';
import Colors from '~/constants/Colors';
import layout from '~/constants/Layout';
import useColorScheme from '~/hooks/useColorScheme';
import { allianceSubjectiveAtom, gameAtom } from '~/state';
import { RootTabScreenProps } from '~/types';
import tw from '~/utils/tailwind';

export function QRCodeCard({ navigation }: RootTabScreenProps) {
  const [game] = useAtom(gameAtom);
  const [allianceSubjective] = useAtom(allianceSubjectiveAtom);

  // the way to check if we are in subjective or objective is to see the scout ID of the subjective info, if it is Red 1 then we are objective

  const isSubjective = allianceSubjective.info.scoutId !== 'Red 1';

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
      {isSubjective ? (
        <Topbar color="blue" text="Subjective" />
      ) : (
        <ObjectiveTopbar />
      )}
      <Container>
        <QRCode
          value={
            isSubjective
              ? encodeSubjective(allianceSubjective)
              : encodeGame(game)
          }
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
