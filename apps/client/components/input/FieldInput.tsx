import { FieldError, FieldValues, UseControllerProps } from 'react-hook-form';
import { BaseElement, Field } from '~/models';
import { IncrementInput } from './IncrementInput';
import { NumericInput } from './NumericInput';
import { PickerInput } from './PickerInput';
import { SwitchInput } from './SwitchInput';
import { TextInput } from './TextInput';
import { Text } from 'react-native';
import tw from '~/utils/tailwind';

type Props<T extends FieldValues> = {
  field: Field;
  bg: BaseElement["colour"];
  label: string;
  error: FieldError | undefined;
  control: UseControllerProps<T>;
};

export const FieldInput = <T extends object>(props: Props<T>) => {
  const { field, bg, ...rest } = props;
  let inputElement: JSX.Element;

  if (field.fieldType === 'Boolean') {
    inputElement = <SwitchInput {...props} />;
  } else if (field.fieldType === 'Text') {
    inputElement = <TextInput {...props} />;
  } else if (field.fieldType === 'Numeric') {
    if (field.incrementable) {
      inputElement = <IncrementInput {...props} />;
    } else {
      inputElement = <NumericInput {...props} />;
    }
  } else if (field.fieldType === 'Dropdown') {
    inputElement = <PickerInput {...props} items={field.options} />;
  } else {
    inputElement = <></>;
  }

  return (
    <>
      {inputElement}
      {props.error && (
        <Text style={tw`text-pheonix-red`}>{props.error.message}</Text>
      )}
    </>
  );
};
