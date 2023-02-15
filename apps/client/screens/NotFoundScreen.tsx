import { Text, TouchableOpacity } from 'react-native';
import { Container } from '~/components/Container';
import { RootTabScreenProps } from '~/types';
import tw from '~/utils/tailwind';

export function NotFoundScreen({ navigation }: RootTabScreenProps) {
  return (
    <Container>
      <Text style={tw`text-xl font-bold`}>This screen doesn't exist.</Text>
      <TouchableOpacity
        onPress={() => navigation.replace('Root')}
        style={tw`mt-4 py-4`}
      >
        <Text style={tw`text-griffins-blue`}>Go to home screen!</Text>
      </TouchableOpacity>
    </Container>
  );
}
