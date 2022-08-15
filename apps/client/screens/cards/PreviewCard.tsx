import { Text } from 'react-native';

// import { gameAtom, saveGameAtom } from '~/state';
import { useAtom } from 'jotai';
import { Topbar } from '~/components/Topbar';
import { RootTabScreenProps } from '~/types';
import { Button } from '~/components/Button';
import { gameAtom } from '~/state';
import { Container } from '~/components/Container';

export function PreviewCard({ navigation }: RootTabScreenProps) {
  const [game] = useAtom(gameAtom);

  // const [_, saveGame] = useAtom(saveGameAtom);

  return (
    <>
      <Topbar />
      <Container>
        <Text>{JSON.stringify(game)}</Text>
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