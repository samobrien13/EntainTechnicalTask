import {fireEvent, render} from '@testing-library/react-native';

import * as ReactQuery from 'react-query';
import {Home} from '..';
import NoRaces from '../__mocks__/no-upcoming-races.json';
import NextToGo from '../__mocks__/next-to-go.json';
import React from 'react';

jest.useFakeTimers().setSystemTime(new Date('2023-03-01T03:38:00Z'));

describe(Home.name, () => {
  it('should display empty state if no upcoming races', async () => {
    jest.spyOn(ReactQuery, 'useQuery').mockImplementation(
      jest.fn().mockReturnValue({
        data: {...NoRaces},
        isFetching: false,
      }),
    );
    const {getByText} = render(<Home />);
    expect(getByText('No upcoming races')).toBeTruthy();
  });

  it('should display 5 races', async () => {
    jest.spyOn(ReactQuery, 'useQuery').mockImplementation(
      jest.fn().mockReturnValue({
        data: {...NextToGo},
        isFetching: false,
      }),
    );
    const {getAllByTestId} = render(<Home />);

    expect(getAllByTestId('race')).toHaveLength(5);
  });

  it('should update state on icon press', async () => {
    jest.spyOn(ReactQuery, 'useQuery').mockImplementation(
      jest.fn().mockReturnValue({
        data: {...NextToGo},
        isFetching: false,
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
