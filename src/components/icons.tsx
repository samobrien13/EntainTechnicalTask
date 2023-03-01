import {Image} from 'react-native';
import {RACE_TYPE_TO_CATEGORY_ID} from '../constants';

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

export const RaceTypeIcon = ({categoryId}: {categoryId: string}) => {
  switch (categoryId) {
    case RACE_TYPE_TO_CATEGORY_ID.horses:
      return <HorsesIcon />;
    case RACE_TYPE_TO_CATEGORY_ID.dogs:
      return <DogsIcon />;
    case RACE_TYPE_TO_CATEGORY_ID.trots:
      return <TrotsIcon />;
    default:
      return null;
  }
};
