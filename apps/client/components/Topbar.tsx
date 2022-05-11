import { useAtom } from 'jotai';
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { infoAtom } from '../state';
import { font } from '../styles/font';
import { Text, View } from './Themed';

export const Topbar = () => {
  const [info] = useAtom(infoAtom);

  const bar = [
    styles.bar,
    info.scoutId.startsWith('B') ? styles.blueBar : styles.redBar,
  ];

  return (
    <View style={bar}>
      <Text style={[font.white, font.bold]}>{info.teamNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
  },
  redBar: {
    backgroundColor: Colors['dark'].tint,
  },
  blueBar: {
    backgroundColor: Colors['light'].tint,
  },
});
