import { autoAtom } from '@/state';
import { autoKeys, autoSchema } from '@/models';
import { RootTabScreenProps } from '@/types';
import { InputModal } from '@/components/input/InputModal';

export function AutoModal(navigation: RootTabScreenProps<'TabOne'>) {
  return (
    <InputModal
      atom={autoAtom}
      navigation={navigation}
      keys={autoKeys}
      nextPage={'Teleop'}
      zodSchema={autoSchema}
    />
  );
}
