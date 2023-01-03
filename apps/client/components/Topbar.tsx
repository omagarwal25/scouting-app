import { useAtom } from 'jotai';
import { FC } from 'react';
import { Text, View } from 'react-native';
import { infoAtom, subjInfoAtom } from '~/state';
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
  const [info] = useAtom(infoAtom);

  return (
    <Topbar
      color={info.scoutId.startsWith('B') ? 'blue' : 'red'}
      text={info.teamNumber}
    />
  );
};

export const SubjectiveTopbar: FC<{ team: 'one' | 'two' | 'three' }> = ({
  team,
}) => {
  const [info] = useAtom(subjInfoAtom);

  const color = info.scoutId.startsWith('B') ? 'blue' : 'red';

  const upperedTeam = team === 'one' ? 'One' : team === 'two' ? 'Two' : 'Three';
  const teamNumber = info[`team${upperedTeam}Number`];

  return <Topbar color={color} text={teamNumber} />;
};
