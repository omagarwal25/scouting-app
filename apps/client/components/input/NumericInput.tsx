import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import useColorScheme from '~/hooks/useColorScheme';
import { TextInput } from 'react-native';
import { InputWrapper } from './InputWrapper';
import tw from '~/utils/tailwind';
import { BaseElement } from '~/models';

type Props<T extends FieldValues> = {
  control: UseControllerProps<T>;
  label: string;
  bg: BaseElement["colour"]
};
export const NumericInput = <T extends object>(props: Props<T>) => {
  const {
    field: { value, onChange, onBlur },
  } = useController(props.control);

  return (
    <InputWrapper label={props.label} bg={props.bg}>
      <TextInput
        style={tw`border h-10 p-2.5 rounded mr-0 ml-auto border-griffins-blue dark:border-pheonix-red dark:text-white`}
        onBlur={onBlur}
        onChangeText={(value) => onChange(Number(value))}
        value={String(value)}
        keyboardType="numeric"
      />
    </InputWrapper>
  );
};
