import { InputModal } from '../components/input/InputModal';
import { endgameKeys, endgameSchema } from '../models';
import { endgameAtom } from '../state';
import { RootTabScreenProps } from '../types';

export function EndgameModal(navigation: RootTabScreenProps<'TabOne'>) {
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
