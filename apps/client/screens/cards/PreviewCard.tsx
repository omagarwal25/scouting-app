import { Text } from 'react-native';
// import { gameAtom, saveGameAtom } from '~/state';
import { useAtom } from 'jotai';
import { Topbar } from '~/components/Topbar';
import { RootTabScreenProps } from '~/types';
import { Button } from '~/components/Button';
import { gameAtom } from '~/state';
import { Container } from '~/components/Container';
import { encodeGame } from '~/models';
import tw from '~/utils/tailwind';

export function PreviewCard({ navigation }: RootTabScreenProps) {
  const [game] = useAtom(gameAtom);

  // const [_, saveGame] = useAtom(saveGameAtom);

  return (
    <>
      <Topbar />
      <Container>
        <Text style={tw`dark:text-white`}>{JSON.stringify(game)}</Text>
        <Text style={tw`dark:text-white`}>
          {encodeGame(game)} {encodeGame(game).length}
        </Text>
        <Button
          onPress={() => {
            navigation.navigate('QR');
          }}
          label="Confirm"
        ></Button>
      </Container>
    </>
  );
}
