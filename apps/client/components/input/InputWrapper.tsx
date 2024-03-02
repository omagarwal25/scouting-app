import { PropsWithChildren } from 'react';
import { View, Text } from 'react-native';
import { BaseElement } from '~/models';
import tw from '~/utils/tailwind';

export const InputWrapper = ({
  children,
  label,
  bg,
}: PropsWithChildren<{ label: string; bg?: BaseElement['colour'] }>) => {
  return (
    <View
      style={tw`mt-0.5 rounded-md p-1 flex-wrap min-w-full items-center flex flex-row ml-auto ${
        bg ? `bg-${bg}-200 dark:bg-transparent` : ''
      }`}
    >
      <Text style={tw`dark:text-white`}>{label}</Text>
      {children}
    </View>
  );
};
