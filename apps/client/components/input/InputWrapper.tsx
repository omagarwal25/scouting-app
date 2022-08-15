import { PropsWithChildren } from 'react';
import { View, Text } from 'react-native';
import tw from '~/utils/tailwind';

export const InputWrapper = ({
  children,
  label,
}: PropsWithChildren<{ label: string }>) => {
  return (
    <View style={tw`mt-0.5 p-1 min-w-full items-center flex flex-row ml-auto`}>
      <Text style={tw`dark:text-white`}>{label}</Text>
      {children}
    </View>
  );
};
