import { Text, View } from 'react-native';

// import { gameAtom, saveGameAtom } from '~/state';

import { saveToLibraryAsync, usePermissions } from 'expo-media-library';
import { useAtom } from 'jotai';
import { useRef } from 'react';
import { Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ObjectiveTopbar, PitTopbar } from '~/components/Topbar';
import Colors from '~/constants/Colors';
import layout from '~/constants/Layout';
import useColorScheme from '~/hooks/useColorScheme';
import { encodeObjectiveRecord, encodePitRecord } from '~/models';
import { objectiveRecordAtom, pitRecordAtom, recordTypeAtom } from '~/state';
import { RootTabScreenProps } from '~/types';
import tw from '~/utils/tailwind';

export function QRCodeCard({ navigation }: RootTabScreenProps) {
  const [status, requestPermission] = usePermissions();
  const [objectiveRecord] = useAtom(objectiveRecordAtom);
  const [pitRecord] = useAtom(pitRecordAtom);
  const imageRef = useRef(null);

  if (status === null) requestPermission();

  const [type] = useAtom(recordTypeAtom);

  const getName = () => {
    const time = new Date().toLocaleTimeString();

    if (type === 'objective') {
      const { teamNumber, matchType, matchNumber, scoutId } =
        objectiveRecord.info;
      return `Objective ${teamNumber} ${matchType} ${matchNumber} ${scoutId} ${time}`;
    }

    const { teamNumber } = pitRecord.info;
    return `Pit ${teamNumber} ${time}`;
  };

  const encoded =
    type === 'objective'
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
          onPress: async () => {
            await onSaveImageAsync();
            navigation.navigate('Root');
          },
        },
      ]
    );

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        quality: 1,
        fileName: getName(),
      });

      await saveToLibraryAsync(localUri);
      if (localUri) {
        // alert('Saved!');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View ref={imageRef}>
      {type === 'objective' ? <ObjectiveTopbar /> : <PitTopbar />}
      <Container>
        <Text style={tw`dark:text-white`}>{getName()}</Text>
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
    </View>
  );
}
