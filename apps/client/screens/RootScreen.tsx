import { useAtom } from 'jotai';
import { Text, View } from 'react-native';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { resetAtoms } from '~/state';
import { RootTabScreenProps } from '~/types';
import tw from '~/utils/tailwind';

export function RootScreen({ navigation }: RootTabScreenProps) {
  const [_, reset] = useAtom(resetAtoms);

  const handleObjective = async () => {
    await reset();
    navigation.navigate('Info');
  };

  const handleSubjective = async () => {
    await reset();
    navigation.navigate('Subjective Info');
  };

  const handleQR = async () => {
    await reset();
    navigation.navigate('Scanner');
  };

  return (
    <Container>
      <Text style={tw`font-bold text-xl dark:text-white`}>Griffins Scout</Text>
      <View style={tw`p-0.5`} />
      <Button label="Manual Entry (Objective)" onPress={handleObjective} />
      <View style={tw`p-0.5`} />
      <Button label="Manual Entry (Subjective)" onPress={handleSubjective} />
      <View style={tw`p-0.5`} />
      <Button label="QR Entry" onPress={handleQR} />
    </Container>
  );
}
