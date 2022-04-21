import { FieldError, UseControllerProps } from 'react-hook-form';
import { Field } from '../../models';
import { input } from '../../styles/input';
import { IncrementInput } from './IncrementInput';
import { NumericInput } from './NumericInput';
import { PickerInput } from './PickerInput';
import { SwitchInput } from './SwitchInput';
import { TextInput } from './TextInput';
import { Text } from '../Themed';

type Props<T> = {
  field: Field;
  label: string;
  error: FieldError | undefined;
  control: UseControllerProps<T>;
};

export const FieldInput = <T extends object>(props: Props<T>) => {
  const { field, ...rest } = props;
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
        <Text style={input.errorText}>{props.error.message}</Text>
      )}
    </>
  );
};
