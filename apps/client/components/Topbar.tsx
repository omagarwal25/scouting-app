import { useAtom } from 'jotai';
import { infoAtom } from '~/state';
import tw from '~/utils/tailwind';
import { Text, View } from 'react-native';

export const Topbar = () => {
  const [info] = useAtom(infoAtom);

  return (
    <View
      style={tw.style(
        'h-10 items-center justify-center min-w-full',
        info.scoutId.startsWith('B') ? 'bg-griffins-blue' : 'bg-pheonix-red'
      )}
    >
      <Text style={tw`font-bold text-white`}>{info.teamNumber}</Text>
    </View>
  );
};
