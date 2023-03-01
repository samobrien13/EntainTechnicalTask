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
import {useEffect, useMemo, useState} from 'react';
import {COLOURS} from '../../constants';

const Separator = () => <View style={styles.separator} />;

const getRaceTypeIcon = (categoryId: string) => {
  switch (categoryId) {
    case RACE_TYPE_TO_CATEGORY_ID.horses:
      return '🏇';
    case RACE_TYPE_TO_CATEGORY_ID.dogs:
      return '🐕';
    case RACE_TYPE_TO_CATEGORY_ID.trots:
      return '🛞';
  }
};

export function Home() {
  const [categories, setCategories] = useState<UseNextToGoParams['categories']>(
    ['horses', 'dogs', 'trots'],
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  const {data, isFetching} = useNextToGo({
    count: 5,
    categories,
  });

  const races = useMemo(() => {
    if (!data || isFetching || !categories.length) {
      return [];
    }
    const raceIds = Object.keys(data.category_race_map).reduce<string[]>(
      (acc, category) => [...acc, ...data.category_race_map[category].race_ids],
      [],
    );

    return raceIds
      .map(raceId => {
        return data.race_summaries[raceId];
      })
      .sort((a, b) => {
        const aDate = new Date(a.advertised_start);
        const bDate = new Date(b.advertised_start);
        return aDate.getTime() - bDate.getTime();
      })
      .slice(0, 5);
  }, [data, categories, isFetching]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onCategoryPress = (category: RaceCategory) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const getTimeToGo = (start: string, now: Date) => {
    const startDateTime = new Date(start);
    const diff = startDateTime.getTime() - now.getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

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
    const aboutToStart = diff < 0 || (minutes < 1 && hours < 1);

    return (
      <Text style={[styles.itemText, aboutToStart && styles.aboutToStart]}>
        {text}
      </Text>
    );
  };

  const renderItem = (item: RaceSummary) => {
    const timeToGo = getTimeToGo(item.advertised_start, currentDate);
    return (
      <TouchableOpacity style={styles.itemContainer}>
        <Text style={styles.itemText}>{`${item.meeting_name} R${
          item.race_number
        } ${getRaceTypeIcon(item.category_id)}`}</Text>
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
            style={[
              styles.iconButton,
              categories.includes('horses') && styles.iconSelected,
            ]}
            onPress={() => onCategoryPress('horses')}>
            <Text style={styles.icon}>🏇</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconButton,
              categories.includes('dogs') && styles.iconSelected,
            ]}
            onPress={() => onCategoryPress('dogs')}>
            <Text style={styles.icon}>🐕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconButton,
              categories.includes('trots') && styles.iconSelected,
            ]}
            onPress={() => onCategoryPress('trots')}>
            <Text style={styles.icon}>🛞</Text>
          </TouchableOpacity>
        </View>
      </View>
      {races?.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.racesContainer}
          data={races}
          renderItem={({item}) => renderItem(item)}
          ItemSeparatorComponent={Separator}
        />
      ) : (
        <ActivityIndicator />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOURS.orange[500],
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
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLOURS.white,
  },
  itemText: {
    fontWeight: '600',
  },
  aboutToStart: {
    color: COLOURS.orange[500],
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
    padding: 16,
  },
  separator: {
    height: 1,
    backgroundColor: COLOURS.gray[200],
  },
});
