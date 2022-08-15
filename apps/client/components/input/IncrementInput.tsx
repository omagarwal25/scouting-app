import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { View } from 'react-native';
import { InputWrapper } from './InputWrapper';
import { Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '~/constants/Colors';
import * as Haptic from 'expo-haptics';
import tw from '~/utils/tailwind';
import useColorScheme from '~/hooks/useColorScheme';

type Props<T extends FieldValues> = {
  control: UseControllerProps<T>;
  label: string;
};
export const IncrementInput = <T extends object>(props: Props<T>) => {
  const colorScheme = useColorScheme();
  const {
    field: { value, onChange, onBlur },
  } = useController(props.control);

  const onIncrement = async () => {
    onChange(Number(value) + 1);
    await Haptic.selectionAsync();
  };

  const onDecrement = async () => {
    onChange(Number(value) - 1);
    await Haptic.selectionAsync();
  };

  return (
    <InputWrapper label={`${props.label}: ${value}`}>
      <View
        style={tw`flex flex-row h-11 p-0.5 items-center justify-center mr-0 ml-auto`}
      >
        <Pressable
          onPress={onIncrement}
          style={tw`border rounded p-3 border-griffins-blue dark:border-pheonix-red`}
        >
          <FontAwesome color={Colors[colorScheme].tint} name="plus" />
        </Pressable>
        <Pressable
          onPress={onDecrement}
          style={tw`border rounded p-3 border-griffins-blue dark:border-pheonix-red ml-2.5`}
        >
          <FontAwesome name="minus" color={Colors[colorScheme].tint} />
        </Pressable>
      </View>
    </InputWrapper>
  );
};
