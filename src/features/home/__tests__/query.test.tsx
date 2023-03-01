import {renderHook, waitFor} from '@testing-library/react-native';
import * as ReactQuery from 'react-query';
import React from 'react';
import {useNextToGo} from '../query';
import NextToGo from '../__mocks__/next-to-go.json';
import {QueryClient, QueryClientProvider} from 'react-query';

// 30 seconds after first race in mock data
jest.useFakeTimers().setSystemTime(new Date('2023-03-01T23:07:30Z'));

jest.spyOn(globalThis, 'setTimeout');

type WrapperParams = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();
const wrapper = ({children}: WrapperParams) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe(useNextToGo.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly transform races', async () => {
    jest.spyOn(ReactQuery, 'useQuery').mockImplementation(
      jest.fn().mockReturnValue({
        data: {...NextToGo},
        isFetching: false,
      }),
    );
    const {result} = renderHook(
      () =>
        useNextToGo({
          categories: ['horses', 'dogs', 'trots'],
        }),
      {wrapper},
    );

    await waitFor(() => expect(result.current.races).toHaveLength(5));
  });

  it('should set correct timeout and refetch when race expires', async () => {
    jest.spyOn(ReactQuery, 'useQuery').mockImplementation(
      jest.fn().mockReturnValue({
        data: {...NextToGo},
        isRefetching: false,
        refetch: jest.fn(),
      }),
    );
    const {result} = renderHook(
      () =>
        useNextToGo({
          categories: ['horses', 'dogs', 'trots'],
        }),
      {wrapper},
    );

    const {races, refetch} = result.current;

    await waitFor(() => expect(races).toHaveLength(5));

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 30000);
    jest.runOnlyPendingTimers();
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
