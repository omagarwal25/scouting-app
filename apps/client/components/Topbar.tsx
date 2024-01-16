import { useAtom } from 'jotai';
import { FC } from 'react';
import { Text, View } from 'react-native';
import { objectiveInfoAtom, pitInfoAtom } from '~/state';
import tw from '~/utils/tailwind';

export const Topbar: FC<{ color: 'blue' | 'red'; text: string | number }> = ({
  color,
  text,
}) => {
  return (
    <View
      style={tw.style(
        'h-10 items-center justify-center min-w-full',
        color === 'blue' ? 'bg-griffins-blue' : 'bg-pheonix-red'
      )}
    >
      <Text style={tw`font-bold text-white`}>{text}</Text>
    </View>
  );
};

export const ObjectiveTopbar = () => {
  const [info] = useAtom(objectiveInfoAtom);

  return (
    <Topbar
      color={info.scoutId.startsWith('B') ? 'blue' : 'red'}
      text={info.teamNumber}
    />
  );
};

export const PitTopbar = () => {
  const [info] = useAtom(pitInfoAtom);

  return <Topbar color={'blue'} text={info.teamNumber} />;
};
