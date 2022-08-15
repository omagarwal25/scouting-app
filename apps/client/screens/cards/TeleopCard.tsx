import { InputModal } from '~/components/input/InputModal';
import { teleopKeys, teleopSchema } from '~/models';
import { teleopAtom } from '~/state';
import { RootTabScreenProps } from '~/types';

export function TeleopCard(navigation: RootTabScreenProps) {
  return (
    <InputModal
      atom={teleopAtom}
      navigation={navigation}
      keys={teleopKeys}
      nextPage={'Endgame'}
      zodSchema={teleopSchema}
    />
  );
}
