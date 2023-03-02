import {useEffect, useMemo, useRef, useState} from 'react';
import {useQuery} from 'react-query';
import {BASE_URL, RACE_TYPE_TO_CATEGORY_ID} from '../../constants';

type GetNextToGoParams = {
  count: number;
  categoryIds: Array<string>;
};

export type RaceSummary = {
  race_id: string;
  race_name: string;
  race_number: string;
  meeting_id: string;
  meeting_name: string;
  category_id: string;
  advertised_start: string;
  race_form: {
    distance: number;
    distanceType: {
      name: 'Metres' | 'Furlongs' | 'Yards' | 'Miles';
      short_name: 'm' | 'f' | 'y' | 'miles';
    };
    track_condition?: {
      name: 'Good' | 'Good4';
      short_name: 'good' | 'good4';
    };
    weather?: {
      name: 'fine' | 'FINE' | 'Clear' | 'OCAST' | 'Cloudy';
    };
    race_comment?: string;
    additional_data?: string;
  };
  venue_id: string;
  venue_name: string;
  venue_state: string;
  venue_country: string;
};

type GetNextToGoResponse = {
  category_race_map: {
    [key: string]: {
      race_ids: Array<string>;
    };
  };
  race_summaries: {
    [key: string]: RaceSummary;
  };
};

const getNextToGo = (
  params: GetNextToGoParams,
): Promise<GetNextToGoResponse> => {
  const categories = encodeURIComponent(`"${params.categoryIds.join('","')}"`);
  const url = `${BASE_URL}racing/next-races-category-group?count=${params.count}&categories=[${categories}]`;

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => data as GetNextToGoResponse);
};

export type RaceCategory = 'horses' | 'dogs' | 'trots';

export type UseNextToGoParams = {
  categories: Array<RaceCategory>;
};

export const useNextToGo = (params: UseNextToGoParams) => {
  const categoryIds = useMemo(
    () => params.categories.map(category => RACE_TYPE_TO_CATEGORY_ID[category]),
    [params.categories],
  );

  const [races, setRaces] = useState<Array<RaceSummary>>([]);
  const timeout = useRef<number>(0);

  const query = useQuery(
    ['GetNextToGo', categoryIds],
    () =>
      getNextToGo({
        count: 10, // API Returns races older than a minute so we need to fetch more than 5
        categoryIds,
      }),
    {
      keepPreviousData: true,
    },
  );

  const {data, refetch, isRefetching} = query;

  // Ideally some of this calculation would be done by the API
  useEffect(() => {
    if (!data || isRefetching) {
      return;
    }

    const raceIds = Object.keys(data.category_race_map).reduce<string[]>(
      (acc, category) => [...acc, ...data.category_race_map[category].race_ids],
      [],
    );

    setRaces(
      raceIds
        .map(raceId => {
          return data.race_summaries[raceId];
        })
        .filter(
          race =>
            // Filter races that started over a minute ago
            (new Date(race.advertised_start).getTime() - new Date().getTime()) /
              1000 >
            -60,
        )
        .sort((a, b) => {
          return (
            new Date(a.advertised_start).getTime() -
            new Date(b.advertised_start).getTime()
          );
        })
        .slice(0, 5),
    );
  }, [data, isRefetching]);

  // Set a timeout to refetch races when the first race started a minute ago
  // Ensures that data is only fetched when needed
  useEffect(() => {
    if (races.length > 0) {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      const timeToRefetch =
        new Date(races[0].advertised_start).getTime() -
        new Date().getTime() +
        60 * 1000;

      timeout.current = setTimeout(() => {
        refetch();
      }, timeToRefetch);
    }

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [races, refetch]);

  return {...query, races};
};
