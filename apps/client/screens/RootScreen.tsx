import { useAtom } from 'jotai';
import { Text, View } from 'react-native';
import { resetGameAtom } from '~/state';
import { RootTabScreenProps } from '~/types';
import { Button } from '~/components/Button';
import tw from '~/utils/tailwind';
import { Container } from '~/components/Container';

export function RootScreen({ navigation }: RootTabScreenProps) {
  const [_, reset] = useAtom(resetGameAtom);

  const handleManual = async () => {
    await reset();
    navigation.navigate('Info');
  };

  const handleQR = async () => {
    await reset();
    navigation.navigate('Scanner');
  };

  return (
    <Container>
      <Text style={tw`font-bold text-xl dark:text-white`}>Griffins Scout</Text>
      <View style={tw`p-0.5`} />
      <Button label="Manual Entry" onPress={handleManual} />
      <View style={tw`p-0.5`} />
      <Button label="QR Entry" onPress={handleQR} />
    </Container>
  );
}
