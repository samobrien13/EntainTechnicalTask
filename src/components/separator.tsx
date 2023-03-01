import {StyleSheet, View} from 'react-native';
import COLOURS from '../colours';

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: COLOURS.gray[200],
  },
});

export default Separator;
