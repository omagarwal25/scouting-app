import { InputModal } from '~/components/input/InputModal';
import { endgameKeys, endgameSchema } from '~/models';
import { endgameAtom } from '~/state';
import { RootTabScreenProps } from '~/types';

export function EndgameCard(navigation: RootTabScreenProps) {
  return (
    <InputModal
      atom={endgameAtom}
      navigation={navigation}
      keys={endgameKeys}
      nextPage={'Postgame'}
      zodSchema={endgameSchema}
    />
  );
}
