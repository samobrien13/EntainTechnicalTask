import {useMemo} from 'react';
import {useQuery} from 'react-query';
import {BASE_URL} from '../../constants';

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

export const RACE_TYPE_TO_CATEGORY_ID = {
  horses: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
  dogs: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
  trots: '161d9be2-e909-4326-8c2c-35ed71fb460b',
};

export type RaceCategory = 'horses' | 'dogs' | 'trots';

export type UseNextToGoParams = {
  count: number;
  categories: Array<RaceCategory>;
};

export const useNextToGo = (params: UseNextToGoParams) => {
  const categoryIds = useMemo(
    () => params.categories.map(category => RACE_TYPE_TO_CATEGORY_ID[category]),
    [params.categories],
  );

  return useQuery(
    ['GetNextToGo', params.count, categoryIds],
    () =>
      getNextToGo({
        count: params.count,
        categoryIds,
      }),
    {
      keepPreviousData: true,
    },
  );
};
