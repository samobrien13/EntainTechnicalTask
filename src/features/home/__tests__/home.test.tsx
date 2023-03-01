import {fireEvent, render} from '@testing-library/react-native';

import * as ReactQuery from 'react-query';
import {Home} from '..';
import NoRaces from '../__mocks__/no-upcoming-races.json';
import NextToGo from '../__mocks__/next-to-go.json';
import React from 'react';
import {act} from 'react-test-renderer';

// 30 seconds after first race in mock data
jest.useFakeTimers().setSystemTime(new Date('2023-03-01T23:07:30Z'));

describe(Home.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display empty state if no upcoming races', async () => {
    jest.spyOn(ReactQuery, 'useQuery').mockImplementation(
      jest.fn().mockReturnValue({
        data: {...NoRaces},
        isLoading: false,
      }),
    );
    const {getByText} = render(<Home />);
    expect(getByText('No upcoming races')).toBeTruthy();
  });

  it('should display 5 races with ticker', async () => {
    jest.spyOn(ReactQuery, 'useQuery').mockImplementation(
      jest.fn().mockReturnValue({
        data: {...NextToGo},
        isLoading: false,
        isRefetching: false,
        refetch: jest.fn(),
      }),
    );
    const {getAllByTestId, getByText} = render(<Home />);

    expect(getAllByTestId('race')).toHaveLength(5);
    expect(getByText('-30s')).toBeTruthy();
    expect(getByText('5m')).toBeTruthy();

    act(() => jest.advanceTimersByTime(3000));

    expect(getByText('-33s')).toBeTruthy();
  });

  it('should update state on icon press', async () => {
    jest.spyOn(ReactQuery, 'useQuery').mockImplementation(
      jest.fn().mockReturnValue({
        data: {...NextToGo},
        isLoading: false,
        isRefetching: false,
        refetch: jest.fn(),
      }),
    );
    const setState = jest.fn();
    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => [['horses', 'dogs'], setState]);
    const {getByTestId} = render(<Home />);
    const horsesIcon = getByTestId('horses-icon');
    fireEvent.press(horsesIcon);
    expect(setState).toHaveBeenCalledWith(['dogs']);
    setState.mockClear();

    const trotsIcon = getByTestId('trots-icon');
    fireEvent.press(trotsIcon);
    expect(setState).toHaveBeenCalledWith(['horses', 'dogs', 'trots']);
  });
});
