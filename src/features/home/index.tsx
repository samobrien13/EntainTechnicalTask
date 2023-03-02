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
  RaceSummary,
  RaceCategory,
} from './query';
import {useEffect, useState} from 'react';
import COLOURS from '../../colours';
import {
  DogsIcon,
  HorsesIcon,
  RaceTypeIcon,
  TrotsIcon,
} from '../../components/icons';
import Separator from '../../components/separator';
import {TimeToGo} from '../../components/timeToGo';

export function Home() {
  const [categories, setCategories] = useState<UseNextToGoParams['categories']>(
    ['horses', 'dogs', 'trots'],
  );
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const {races, isLoading} = useNextToGo({
    categories,
  });

  // Creates a timer to re-render the component every second and update the countdowns
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

  const renderItem = (item: RaceSummary) => {
    return (
      <TouchableOpacity testID="race" style={styles.itemContainer}>
        <View>
          <View style={styles.itemTitleContainer}>
            <Text style={[styles.itemText, {marginRight: 4}]}>
              {`${item.meeting_name} (${item.venue_state})`}
            </Text>
            <RaceTypeIcon categoryId={item.category_id} />
          </View>
          <Text style={styles.raceNumber}>{`Race ${item.race_number}`}</Text>
        </View>
        <TimeToGo start={item.advertised_start} currentTime={currentTime} />
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
