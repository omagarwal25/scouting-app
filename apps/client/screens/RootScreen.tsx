import { useAtom } from 'jotai';
import { Switch, Text, View } from 'react-native';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { InputWrapper } from '~/components/input/InputWrapper';
import {
  appSettingsAtom,
  onlineAtom,
  recordTypeAtom,
  resetAtom,
} from '~/state';
import { RootTabScreenProps } from '~/types';
import tw from '~/utils/tailwind';

export function RootScreen({ navigation }: RootTabScreenProps) {
  const [_reset, reset] = useAtom(resetAtom);
  const [_type, setType] = useAtom(recordTypeAtom);
  const [settings, setSettings] = useAtom(appSettingsAtom);
  const [isOnline] = useAtom(onlineAtom);

  const handleObjective = async () => {
    await reset();
    setType('objective');
    navigation.navigate('ObjectiveInfo');
  };

  const handleSubjective = async () => {
    await reset();
    setType('subjective');
    navigation.navigate('SubjectiveInfo');
  };

  const handlePit = async () => {
    await reset();
    setType('pit');
    navigation.navigate('PitInfo');
  };

  const handleQR = async () => {
    await reset();
    navigation.navigate('Scanner');
  };

  const handleSwitch = (value: boolean) => {
    setSettings(
      value
        ? { connection: 'online', match: null, scoutId: null }
        : { connection: 'offline' }
    );
  };

  return (
    <Container>
      <Text style={tw`font-bold text-xl dark:text-white`}>Griffins Scout</Text>
      <InputWrapper label="Online Mode">
        <Switch
          style={tw`h-10 p-2.5 mr-0 ml-auto`}
          onValueChange={handleSwitch}
          value={isOnline}
        />
      </InputWrapper>
      <View style={tw`p-0.5`} />
      <Button label="Manual Entry (Objective)" onPress={handleObjective} />
      <View style={tw`p-0.5`} />
      <Button label="Manual Entry (Subjective)" onPress={handleSubjective} />
      <View style={tw`p-0.5`} />
      <Button label="Manual Entry (Pit)" onPress={handlePit} />
      <View style={tw`p-0.5`} />
      <Button label="QR Entry" onPress={handleQR} />
    </Container>
  );
}
