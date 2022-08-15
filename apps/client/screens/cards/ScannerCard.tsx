import type { BarCodeScannedCallback } from 'expo-barcode-scanner';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { Text } from 'react-native';
import type { RootTabScreenProps } from '~/types';
import { infoAtom } from '~/state';
import { useAtom } from 'jotai';
import type { Info } from '@griffins-scout/game';
import { decode, infoKeys } from '@griffins-scout/game';
import { Container } from '~/components/Container';
import tw from '~/utils/tailwind';

export const ScannerCard = ({ navigation }: RootTabScreenProps) => {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [_, setGameInfo] = useAtom(infoAtom);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned: BarCodeScannedCallback = async ({ data }) => {
    setScanned(true);
    await setGameInfo(decode<Info>(data, infoKeys));

    navigation.navigate('Pregame');
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Container>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={tw`absolute top-0 bottom-0 left-0 right-0`}
      />
      {scanned && (
        <Pressable onPress={() => setScanned(false)}>
          <Text>Tap to Scan again</Text>
        </Pressable>
      )}
    </Container>
  );
};
