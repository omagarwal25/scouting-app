import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import tw from '~/utils/tailwind';
import { InputWrapper } from './InputWrapper';

type Props<T extends FieldValues> = {
  control: UseControllerProps<T>;
  label: string;
  items: string[];
};

export const NativePickerInput = <T extends object>(props: Props<T>) => {
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

const MultiButton = <T extends object>(props: Props<T>) => {
  const {
    field: { value, onChange },
  } = useController(props.control);

  const onPick = async (e: unknown) => {
    onChange(e);
    await Haptics.selectionAsync();
  };

  return (
    <InputWrapper label={`${props.label}: ${value}`}>
      <View
        style={tw`flex flex-row p-0.5 items-center justify-center mr-0 ml-auto`}
      >
        {props.items.map((e) => (
          <Pressable
            onPress={() => onPick(e)}
            key={e}
            style={tw`ml-2 border rounded p-3 flex items-center border-griffins-blue dark:border-pheonix-red ${value === e ? 'bg-griffins-blue dark:bg-pheonix-red' : ''
              }`}
          >
            <Text style={tw`dark:text-white`}>{e}</Text>
          </Pressable>
        ))}
      </View>
    </InputWrapper>
  );
};

export const PickerInput = <T extends object>(props: Props<T>) => {
  if (props.items.length <= 5) {
    return <MultiButton {...props} />;
  }
  return <NativePickerInput {...props} />;
};
