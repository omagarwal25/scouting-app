import { View } from 'react-native';

// import { gameAtom, saveGameAtom } from '~/state';

import { useAtom } from 'jotai';
import { Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ObjectiveTopbar, PitTobar, Topbar } from '~/components/Topbar';
import Colors from '~/constants/Colors';
import layout from '~/constants/Layout';
import useColorScheme from '~/hooks/useColorScheme';
import {
  encodeObjectiveRecord,
  encodePitRecord,
  encodeSubjectiveRecord,
} from '~/models';
import {
  objectiveRecordAtom,
  pitRecordAtom,
  recordTypeAtom,
  subjectiveRecordAtom,
} from '~/state';
import { RootTabScreenProps } from '~/types';
import tw from '~/utils/tailwind';

export function QRCodeCard({ navigation }: RootTabScreenProps) {
  const [objectiveRecord] = useAtom(objectiveRecordAtom);
  const [subjectiveRecord] = useAtom(subjectiveRecordAtom);
  const [pitRecord] = useAtom(pitRecordAtom);

  // the way to check if we are in subjective or objective is to see the scout ID of the subjective info, if it is Red 1 then we are objective

  const [type] = useAtom(recordTypeAtom);

  const encoded =
    type === 'subjective'
      ? encodeSubjectiveRecord(subjectiveRecord)
      : type === 'objective'
      ? encodeObjectiveRecord(objectiveRecord)
      : encodePitRecord(pitRecord);

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
      {type === 'subjective' ? (
        <Topbar color="blue" text="Subjective" />
      ) : type === 'objective' ? (
        <ObjectiveTopbar />
      ) : (
        <PitTobar />
      )}
      <Container>
        <QRCode
          value={encoded}
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
