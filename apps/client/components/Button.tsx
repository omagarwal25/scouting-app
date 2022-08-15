import { FC } from 'react';
import { PressableProps, Pressable } from 'react-native';
import tw from '~/utils/tailwind';
import { TextProps, Text } from 'react-native';

type Props = {
  text?: Omit<TextProps, 'style'>;
  label?: string;
} & Omit<PressableProps, 'style'>;

export const Button: FC<Props> = (props) => {
  const { text, label, children, ...pressableProps } = props;
  return (
    <Pressable
      style={({ pressed }) =>
        tw.style(
          'items-center justify-center py-[12px] px-[32px] rounded elevation-3',
          pressed && 'opacity-50',
          'dark:bg-pheonix-red bg-griffins-blue'
        )
      }
      {...pressableProps}
    >
      {children || (
        <Text style={tw`text-white`} {...text}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};
