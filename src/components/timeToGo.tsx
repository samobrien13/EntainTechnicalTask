import {Text} from 'react-native';
import COLOURS from '../colours';

type TimeToGoProps = {
  start: string;
  currentTime: number;
};

export const TimeToGo = ({start, currentTime}: TimeToGoProps) => {
  const startDateTime = new Date(start);
  const diff = startDateTime.getTime() - currentTime;
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
      style={{
        fontWeight: '600',
        color:
          diffInSeconds < 60
            ? COLOURS.red[500]
            : diffInSeconds < 180
            ? COLOURS.orange[500]
            : COLOURS.black,
      }}>
      {text}
    </Text>
  );
};
