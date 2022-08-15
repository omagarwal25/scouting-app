import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { TextInput as RInput } from 'react-native';
import { InputWrapper } from './InputWrapper';
import tw from '~/utils/tailwind';

type Props<T extends FieldValues> = {
  control: UseControllerProps<T>;
  label: string;
};
export const TextInput = <T extends object>(props: Props<T>) => {
  const {
    field: { value, onChange, onBlur },
  } = useController(props.control);

  return (
    <InputWrapper label={props.label}>
      <RInput
        style={tw`border h-10 p-2.5 rounded mr-0 ml-auto border-griffins-blue dark:border-pheonix-red dark:text-white`}
        onBlur={onBlur}
        onChangeText={(value) => onChange(value)}
        value={String(value)}
      />
    </InputWrapper>
  );
};
