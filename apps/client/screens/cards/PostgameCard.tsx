import { InputModal } from '~/components/input/InputModal';
import { postgameKeys, postgameSchema } from '~/models';
import { postgameAtom } from '~/state';
import { RootTabScreenProps } from '~/types';

export function PostgameCard(navigtaion: RootTabScreenProps) {
  return (
    <InputModal
      atom={postgameAtom}
      navigation={navigtaion}
      keys={postgameKeys}
      nextPage={'Preview'}
      zodSchema={postgameSchema}
    />
  );
}
