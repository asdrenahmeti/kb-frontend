import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import Booking from './Booking';

interface BookingData {
  id: string;
  startTime: string;
  endTime: string;
  roomId: string;
  [key: string]: any; // Additional properties
}

interface Room {
  id: string;
  name: string;
  bookings: BookingData[];
}

interface Data {
  rooms: Room[];
}

interface BookingGridProps {
  data: Data | null;
  startHour: string;
  endHour: string;
  handleBoxClick: (time: string, roomId: string, roomName: string) => void;
  handleBoxDrag: (
    momentaryPosition: { x: number; y: number },
    roomId: string,
    bookingStartTime: string
  ) => any;
  setActiveBooking: (booking: { booking: BookingData; room: Room }) => void;
  setDraggedBooking: (booking: { old: BookingData; new: BookingData }) => void;
  setShowDragConfirmModal: (show: boolean) => void;
  cancelDrag: boolean;
  resetPosition: boolean;
}

const generateTimeIntervals = (
  startHour: string,
  endHour: string
): string[] => {
  const startTime = DateTime.fromFormat(startHour, 'HH:mm', { zone: 'utc' });
  let endTime = DateTime.fromFormat(endHour, 'HH:mm', { zone: 'utc' });

  if (endTime < startTime) {
    endTime = endTime.plus({ days: 1 });
  }

  const hoursDiff = Math.abs(endTime.diff(startTime, 'hours').hours);
  const intervals = Array.from({ length: hoursDiff + 1 }, (_, index) =>
    startTime.plus({ hours: index }).toFormat('HH:mm')
  );

  return intervals;
};

const calculateNumberOfFiveMinuteIntervals = (
  startHour: string,
  endHour: string
): number => {
  const startTime = DateTime.fromFormat(startHour, 'HH:mm', { zone: 'utc' });
  let endTime = DateTime.fromFormat(endHour, 'HH:mm', { zone: 'utc' });

  if (endTime < startTime) {
    endTime = endTime.plus({ days: 1 });
  }

  const diffInMinutes = endTime.diff(startTime, 'minutes').minutes;
  const numberOfIntervals = Math.abs(Math.ceil(diffInMinutes / 5));

  return numberOfIntervals;
};

const BookingGrid: React.FC<BookingGridProps> = ({
  data,
  startHour,
  endHour,
  handleBoxClick,
  handleBoxDrag,
  setActiveBooking,
  setDraggedBooking,
  setShowDragConfirmModal,
  cancelDrag,
  resetPosition
}) => {
  const [timeIntervals, setTimeIntervals] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (startHour && endHour) {
      const intervals = generateTimeIntervals(startHour, endHour);
      setTimeIntervals(intervals);
    }
  }, [startHour, endHour]);

  const handleBookingClick = (booking: BookingData, room: Room) => {
    if (!isDragging) {
      setSelectedBooking(booking);
      setActiveBooking({ booking: booking, room: room });
    }
  };

  const calculateLeftPosition = (
    startTime: string,
    startHour: string
  ): number => {
    const startTimeObj = DateTime.fromISO(startTime, { zone: 'utc' });
    const startDate = startTimeObj.toISODate();
    const startHourObj = DateTime.fromISO(`${startDate}T${startHour}:00.000Z`, {
      zone: 'utc'
    });

    const diffInMinutes = startTimeObj.diff(startHourObj, 'minutes').minutes;
    const leftPosition = (diffInMinutes / 5) * 30;

    // Verify if we should divide by 2 as a temporary measure to check the logic
    const adjustedLeftPosition = leftPosition / 2;
    return adjustedLeftPosition;
  };

  useEffect(() => {
    if (data) {
      data.rooms.forEach(room => {
        room.bookings.forEach(booking => {
          booking.left = calculateLeftPosition(booking.startTime, startHour);
        });
      });
    }
  }, [data, startHour]);

  return (
    <div className='relative mt-8 w-full'>
      <div className='grid grid-cols-[120px_auto] mb-1'>
        <div className='col-start-2 grid grid-flow-col auto-cols-min'>
          {timeIntervals.map((item, index) => (
            <div
              key={index + 'time-interval'}
              className='w-[360px] border-l-2 border-kb-secondary relative'
            >
              <p className='ml-1 text-kb-primary inline-block'>{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='relative w-full'>
        {data?.rooms?.map((room, roomIndex) => (
          <div
            key={room.id}
            className='relative w-full grid grid-cols-[120px_auto] mb-2'
          >
            <div
              className={`h-[35px] w-[120px] rounded-tl-md rounded-bl-md text-sm bg-kb-primary text-white pl-2 flex items-center font-semibold sticky`}
              style={{ left: '0', zIndex: 10 }}
            >
              {room.name}
            </div>
            <div className='col-start-2 grid grid-flow-col auto-cols-min relative'>
              {Array.from(
                {
                  length: calculateNumberOfFiveMinuteIntervals(
                    startHour,
                    endHour
                  )
                },
                (_, index) => {
                  const currentTime = DateTime.fromFormat(startHour, 'HH:mm', {
                    zone: 'utc'
                  }).plus({ minutes: index * 5 });
                  const currentTimeISO = currentTime.toFormat('HH:mm');

                  const roomBookings = room?.bookings || [];

                  const isDisabled = roomBookings.some(booking => {
                    const bookingStart = DateTime.fromISO(booking.startTime, {
                      zone: 'utc'
                    });
                    const bookingEnd = DateTime.fromISO(booking.endTime, {
                      zone: 'utc'
                    });
                    const boxTime = DateTime.fromFormat(
                      currentTimeISO,
                      'HH:mm',
                      { zone: 'utc' }
                    );

                    return (
                      (boxTime >= bookingStart && boxTime < bookingEnd) ||
                      boxTime.equals(bookingStart.minus({ minutes: 5 })) ||
                      boxTime.equals(bookingEnd)
                    );
                  });

                  return (
                    <div
                      key={index + 'disabled'}
                      className={`w-[30px] h-[35px] border-l border-t border-b border-r-none border-slate-300 ${
                        isDisabled
                          ? 'bg-gray-200 pointer-events-none'
                          : 'hover:border-r hover:border-kb-primary hover:cursor-pointer hover:duration-75 transition-all'
                      } relative group`}
                      data-time={currentTimeISO}
                      onClick={() => {
                        if (!isDisabled) {
                          handleBoxClick(currentTimeISO, room?.id, room?.name);
                        }
                      }}
                    >
                      <div className='absolute top-100% transform -translate-y-full left-1/2 -translate-x-1/2 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity z-10'>
                        {currentTimeISO}
                      </div>
                    </div>
                  );
                }
              )}

              {room?.bookings?.map((booking, bookingIndex) => {
                const startTime = DateTime.fromISO(booking.startTime, {
                  zone: 'utc'
                });
                const endTime = DateTime.fromISO(booking.endTime, {
                  zone: 'utc'
                });

                const left = calculateLeftPosition(
                  booking.startTime,
                  startHour
                );

                const durationInMinutes = endTime.diff(
                  startTime,
                  'minutes'
                ).minutes;
                const width = (durationInMinutes / 5) * 30;

                return (
                  <Booking
                    key={booking.id + '-' + roomIndex}
                    index={booking.id + '-' + roomIndex}
                    booking={booking}
                    left={left}
                    boxWidth={30}
                    handleDrag={momentaryPosition =>
                      handleBoxDrag(
                        momentaryPosition,
                        booking.roomId,
                        booking.startTime
                      )
                    }
                    setDraggedBooking={setDraggedBooking}
                    setShowDragConfirmModal={setShowDragConfirmModal}
                    cancelDrag={cancelDrag}
                  >
                    <div
                      key={booking.id}
                      className={`absolute rounded-full text-xs text-white flex items-center justify-between px-4 border h-[30px] top-[2.5px] shadow-sm cursor-pointer handle ${
                        selectedBooking === booking
                          ? 'bg-blue-500'
                          : 'bg-kb-secondary'
                      }`}
                      style={{
                        width: `${width}px`,
                        left: `${left}px`,
                        zIndex: 5
                      }}
                      onClick={e => handleBookingClick(booking, room)}
                    >
                      {startTime.toFormat('HH:mm')} -{' '}
                      {endTime.toFormat('HH:mm')}
                      <p className='font-semibold'>User 1</p>
                    </div>
                  </Booking>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingGrid;
