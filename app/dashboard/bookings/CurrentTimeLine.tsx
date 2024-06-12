import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

interface CurrentTimeLineProps {
  startHour: string;
}

const calculateCurrentTimePosition = (
  startHour: string,
  currentTime: DateTime
): number => {
  const startTime = DateTime.fromFormat(startHour, 'HH:mm');
  const diffInMinutes = currentTime.diff(startTime, 'minutes').minutes;
  const position = (diffInMinutes / 5) * 30; // 30px per 5-minute interval
  const offset = 120; // Offset for room names

  return position + offset;
};

const CurrentTimeLine: React.FC<CurrentTimeLineProps> = ({ startHour }) => {
  const [position, setPosition] = useState<number>(0);

  useEffect(() => {
    const updatePosition = () => {
      const currentTime = DateTime.local();
      const newPosition = calculateCurrentTimePosition(startHour, currentTime);
      setPosition(newPosition);
    };

    // Initial call
    updatePosition();

    // Calculate the remaining time until the next minute
    const now = DateTime.local();
    const millisecondsUntilNextMinute = (60 - now.second) * 1000;

    // Set a timeout to update at the start of the next minute
    const timeoutId = setTimeout(() => {
      updatePosition();

      // Set an interval to update every minute after that
      const intervalId = setInterval(updatePosition, 60000);

      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }, millisecondsUntilNextMinute);

    // Clean up timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [startHour]);

  return (
    <div>
      <div
        className='absolute bottom-0 h-[100%] border-l-[1px] border-[#ba98c8] flex items-center'
        style={{ left: `${position}px`, zIndex: 20 }}
      >
        <div className='ml-1 text-sm font-medium absolute top-0'>
          {DateTime.local().toFormat('HH:mm')}
        </div>
      </div>
    </div>
  );
};

export default CurrentTimeLine;
