import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  UseNextToGoParams,
  useNextToGo,
  RACE_TYPE_TO_CATEGORY_ID,
  RaceSummary,
  RaceCategory,
} from './query';
import {useEffect, useState} from 'react';
import COLOURS from '../../colours';
import {DogsIcon, HorsesIcon, TrotsIcon} from '../../components/icons';
import Separator from '../../components/separator';

export function Home() {
  const [categories, setCategories] = useState<UseNextToGoParams['categories']>(
    ['horses', 'dogs', 'trots'],
  );
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const {races, isLoading} = useNextToGo({
    count: 10,
    categories,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onCategoryPress = (category: RaceCategory) => {
    if (categories.length === 1 && categories.includes(category)) {
      return;
    }
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const getRaceTypeIcon = (categoryId: string) => {
    switch (categoryId) {
      case RACE_TYPE_TO_CATEGORY_ID.horses:
        return <HorsesIcon />;
      case RACE_TYPE_TO_CATEGORY_ID.dogs:
        return <DogsIcon />;
      case RACE_TYPE_TO_CATEGORY_ID.trots:
        return <TrotsIcon />;
    }
  };

  const getTimeToGo = (start: string, now: number) => {
    const startDateTime = new Date(start);
    const diff = startDateTime.getTime() - now;
    const diffInSeconds = diff / 1000;
    const hours = Math.floor(diffInSeconds / 60 / 60);
    const minutesDiff = (diffInSeconds / 60) % 60;

    // Round minutes up if negative, down if positive
    const minutes =
      minutesDiff > 0 ? Math.floor(minutesDiff) : Math.ceil(minutesDiff);
    const seconds = Math.floor(diffInSeconds % 60);

    let text = '';
    if (hours > 0) {
      text = `${hours}h ${Math.abs(minutes)}m`;
    } else if (minutes === 0) {
      text = `${seconds}s`;
    } else if (Math.abs(minutes) < 3) {
      text = `${minutes}m ${Math.abs(seconds)}s`;
    } else {
      text = `${minutes}m`;
    }

    return (
      <Text
        style={[
          styles.itemText,
          {
            color:
              diffInSeconds < 60
                ? COLOURS.red[500]
                : diffInSeconds < 180
                ? COLOURS.orange[500]
                : COLOURS.black,
          },
        ]}>
        {text}
      </Text>
    );
  };

  const renderItem = (item: RaceSummary) => {
    const timeToGo = getTimeToGo(item.advertised_start, currentTime);
    return (
      <TouchableOpacity testID="race" style={styles.itemContainer}>
        <View>
          <View style={styles.itemTitleContainer}>
            <Text style={[styles.itemText, {marginRight: 4}]}>
              {`${item.meeting_name} (${item.venue_state})`}
            </Text>
            {getRaceTypeIcon(item.category_id)}
          </View>
          <Text style={styles.raceNumber}>{`Race ${item.race_number}`}</Text>
        </View>
        {timeToGo}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headingContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Next to go</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            testID="horses-icon"
            style={[
              styles.iconButton,
              categories.includes('horses') && styles.iconSelected,
              {marginRight: 2},
            ]}
            onPress={() => onCategoryPress('horses')}>
            <HorsesIcon size={32} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="dogs-icon"
            style={[
              styles.iconButton,
              categories.includes('dogs') && styles.iconSelected,
              {marginHorizontal: 2},
            ]}
            onPress={() => onCategoryPress('dogs')}>
            <DogsIcon size={32} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="trots-icon"
            style={[
              styles.iconButton,
              categories.includes('trots') && styles.iconSelected,
              {marginLeft: 2},
            ]}
            onPress={() => onCategoryPress('trots')}>
            <TrotsIcon size={32} />
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.indicator} />
      ) : (
        <FlatList
          contentContainerStyle={styles.racesContainer}
          data={races}
          renderItem={({item}) => renderItem(item)}
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={<Text>No upcoming races</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOURS.orange[500],
  },
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOURS.white,
  },
  headingContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  iconSelected: {
    backgroundColor: COLOURS.white,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLOURS.white,
  },
  itemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    color: COLOURS.black,
    fontWeight: '600',
  },
  raceNumber: {
    color: COLOURS.indigo[500],
  },
  racesContainer: {
    flex: 1,
    fontSize: 18,
    padding: 16,
    fontWeight: '400',
    backgroundColor: COLOURS.white,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
});
