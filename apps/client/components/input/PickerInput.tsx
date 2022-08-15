import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';
import { InputWrapper } from './InputWrapper';
import tw from '~/utils/tailwind';

type Props<T extends FieldValues> = {
  control: UseControllerProps<T>;
  label: string;
  items: string[];
};
export const PickerInput = <T extends object>(props: Props<T>) => {
  const {
    field: { value, onChange },
  } = useController(props.control);

  const onPick = async (e: unknown) => {
    onChange(e);
    await Haptics.selectionAsync();
  };

  return (
    <InputWrapper label={props.label}>
      <Picker
        style={tw`w-1/2 rounded mr-0 ml-auto border dark:border-pheonix-red border-griffins-blue dark:text-white`}
        selectedValue={value}
        itemStyle={tw`dark:text-white text-black`}
        onValueChange={(itemValue) => onPick(itemValue)}
      >
        {props.items.map((e) => (
          <Picker.Item label={e} value={e} key={e} />
        ))}
      </Picker>
    </InputWrapper>
  );
};
