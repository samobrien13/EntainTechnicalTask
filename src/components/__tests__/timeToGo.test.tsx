import {render} from '@testing-library/react-native';
import React from 'react';
import {TimeToGo} from '../timeToGo';

jest.useFakeTimers().setSystemTime(new Date('2023-03-01T23:07:30Z'));

describe(TimeToGo.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display 0s if times match', async () => {
    const {getByText} = render(
      <TimeToGo
        start="2023-03-01T23:07:30Z"
        currentTime={new Date().getTime()}
      />,
    );
    expect(getByText('0s')).toBeTruthy();
  });

  it('should display minutes if over 3 minutes to go', async () => {
    const {getByText} = render(
      <TimeToGo
        start="2023-03-01T23:10:31Z"
        currentTime={new Date().getTime()}
      />,
    );
    expect(getByText('3m')).toBeTruthy();
  });

  it('should display minutes and seconds if under 3 minutes to go', async () => {
    const {getByText} = render(
      <TimeToGo
        start="2023-03-01T23:10:29Z"
        currentTime={new Date().getTime()}
      />,
    );
    expect(getByText('2m 59s')).toBeTruthy();
  });

  it('should display seconds if under 1 minute to go', async () => {
    const {getByText} = render(
      <TimeToGo
        start="2023-03-01T23:08:29Z"
        currentTime={new Date().getTime()}
      />,
    );
    expect(getByText('59s')).toBeTruthy();
  });

  it('should display negative seconds if start time passed', async () => {
    const {getByText} = render(
      <TimeToGo
        start="2023-03-01T23:06:31Z"
        currentTime={new Date().getTime()}
      />,
    );
    expect(getByText('-59s')).toBeTruthy();
  });

  it('should display hours and minutes over an hour to go', async () => {
    const {getByText} = render(
      <TimeToGo
        start="2023-03-02T00:08:30Z"
        currentTime={new Date().getTime()}
      />,
    );
    expect(getByText('1h 1m')).toBeTruthy();
  });
});
