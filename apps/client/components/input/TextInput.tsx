import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { TextInput as RInput } from 'react-native';
import tw from '~/utils/tailwind';
import { InputWrapper } from './InputWrapper';

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
        style={tw`border p-2.5 rounded mr-0 ml-auto border-griffins-blue dark:border-pheonix-red dark:text-white w-1/2`}
        multiline
        onBlur={onBlur}
        onChangeText={(value) => onChange(value)}
        value={String(value)}
      />
    </InputWrapper>
  );
};
