import { InputModal } from '@/components/input/InputModal';
import { teleopKeys, teleopSchema } from '@/models';
import { teleopAtom } from '@/state';
import { RootTabScreenProps } from '@/types';

export function TeleopModal(navigation: RootTabScreenProps<'TabOne'>) {
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
