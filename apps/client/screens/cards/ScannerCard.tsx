import type { BarCodeScannedCallback } from 'expo-barcode-scanner';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { decodeInfo } from '~/models';
import { objectiveInfoAtom, pitInfoAtom, recordTypeAtom } from '~/state';
import type { RootTabScreenProps } from '~/types';
import tw from '~/utils/tailwind';

export const ScannerCard = ({ navigation }: RootTabScreenProps) => {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [_objectiveInfo, setObjectiveInfo] = useAtom(objectiveInfoAtom);
  const [_pitInfo, setPitInfo] = useAtom(pitInfoAtom);
  const [_type, setType] = useAtom(recordTypeAtom);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned: BarCodeScannedCallback = async ({ data }) => {
    setScanned(true);
    const { type, info } = decodeInfo(data);

    if (type === 'objective') {
      await setObjectiveInfo(info);
      await setType('objective');
      navigation.navigate('ObjectiveInfo');
    } else if (type === 'pit') {
      await setPitInfo(info);
      await setType('pit');
      navigation.navigate('PitInfo');
    }
  };

  if (hasPermission === null || hasPermission === undefined) {
    return (
      <Text style={tw`dark:text-white`}>Requesting for camera permission</Text>
    );
  }

  if (hasPermission === false) {
    return <Text style={tw`dark:text-white`}>No access to camera</Text>;
  }

  return (
    <>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Pressable onPress={() => setScanned(false)}>
          <Text style={tw`dark:text-white`}>Tap to Scan again</Text>
        </Pressable>
      )}
    </>
  );
};
