import { infoKeys, infoSchema } from '@griffins-scout/game';
import { InputModal } from '~/components/input/InputModal';
import { infoAtom } from '~/state';
import { RootTabScreenProps } from '~/types';

export function InfoCard(navigation: RootTabScreenProps) {
  return (
    <InputModal
      atom={infoAtom}
      navigation={navigation}
      keys={infoKeys}
      nextPage={'Pregame'}
      zodSchema={infoSchema}
    />
  );
}
