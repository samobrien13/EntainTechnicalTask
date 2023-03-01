import {Image} from 'react-native';

export const HorsesIcon = ({size = 20}) => (
  <Image
    style={{width: size, height: size}}
    source={require('../assets/images/horses.png')}
  />
);

export const DogsIcon = ({size = 20}) => (
  <Image
    style={{width: size, height: size}}
    source={require('../assets/images/dogs.png')}
  />
);

export const TrotsIcon = ({size = 20}) => (
  <Image
    style={{width: size, height: size}}
    source={require('../assets/images/trots.png')}
  />
);
