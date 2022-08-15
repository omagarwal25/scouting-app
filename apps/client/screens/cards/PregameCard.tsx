import { InputModal } from '~/components/input/InputModal';
import { pregameKeys, pregameSchema } from '~/models';
import { pregameAtom } from '~/state';
import { RootTabScreenProps } from '~/types';

export function PregameCard(navigation: RootTabScreenProps) {
  return (
    <InputModal
      atom={pregameAtom}
      navigation={navigation}
      keys={pregameKeys}
      nextPage={'Auto'}
      zodSchema={pregameSchema}
    />
  );
}
