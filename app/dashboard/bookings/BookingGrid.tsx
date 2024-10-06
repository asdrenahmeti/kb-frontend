import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import Booking from "./Booking";

interface BookingData {
  id: string;
  startTime: string;
  endTime: string;
  roomId: string;
  [key: string]: any;
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
  data: any;
  startHour: string;
  endHour: string;
  handleBoxClick: (time: string, roomId: string, roomName: string) => void;
  handleBoxDrag: (
    momentaryPosition: { x: number; y: number },
    roomId: string,
    bookingStartTime: string
  ) => void;
  setActiveBooking: (booking: any) => void;
  setDraggedBooking: (booking: any) => void;
  setShowDragConfirmModal: (show: boolean) => void;
  cancelDrag: boolean;
  resetPosition: boolean;
  currentDate: string;
}

const generateTimeIntervals = (
  startHour: string,
  endHour: string
): string[] => {
  const startTime = DateTime.fromFormat(startHour, "HH:mm", { zone: "utc" });
  let endTime = DateTime.fromFormat(endHour, "HH:mm", { zone: "utc" });

  if (endTime < startTime) {
    endTime = endTime.plus({ days: 1 });
  }

  const hoursDiff = Math.abs(endTime.diff(startTime, "hours").hours);
  const intervals = Array.from({ length: hoursDiff + 1 }, (_, index) =>
    startTime.plus({ hours: index }).toFormat("HH:mm")
  );

  return intervals;
};

const calculateNumberOfFiveMinuteIntervals = (
  startHour: string,
  endHour: string
): number => {
  const startTime = DateTime.fromFormat(startHour, "HH:mm", { zone: "utc" });
  let endTime = DateTime.fromFormat(endHour, "HH:mm", { zone: "utc" });

  if (endTime < startTime) {
    endTime = endTime.plus({ days: 1 });
  }

  const diffInMinutes = endTime.diff(startTime, "minutes").minutes;
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
  resetPosition,
  currentDate,
}) => {
  const [timeIntervals, setTimeIntervals] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const roomHeight = 35; // Define the room height

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
    const startTimeObj = DateTime.fromISO(startTime, { zone: "utc" });
    const startDate = startTimeObj.toISODate();
    let startHourObj = DateTime.fromISO(`${startDate}T${startHour}:00.000Z`, {
      zone: "utc",
    });

    // Adjust for cases where the start time is before the start hour
    if (startTimeObj < startHourObj) {
      startHourObj = startHourObj.minus({ days: 1 });
    }

    const diffInMinutes = startTimeObj.diff(startHourObj, "minutes").minutes;
    const leftPosition = (diffInMinutes / 5) * 30;

    return leftPosition;
  };

  useEffect(() => {
    if (data) {
      data.rooms.forEach((room: any) => {
        room.bookings.forEach((booking: any) => {
          booking.left = calculateLeftPosition(booking.startTime, startHour);
        });
      });
    }
  }, [data, startHour]);

  const handleDrag = (
    momentaryPosition: { x: number; y: number },
    roomId: string,
    bookingStartTime: string
  ) => {
    const roomIndex = data?.rooms.findIndex((room: any) => room.id === roomId);
    if (roomIndex !== undefined && roomIndex >= 0) {
      const rowsToConsider = 2; // Number of rows to allow dragging within
      const startRowIndex =
        Math.floor(roomIndex / rowsToConsider) * rowsToConsider;
      const endRowIndex = startRowIndex + rowsToConsider;

      const roomTop = startRowIndex * roomHeight;
      const roomBottom = endRowIndex * roomHeight;

      if (momentaryPosition.y >= roomTop && momentaryPosition.y < roomBottom) {
        handleBoxDrag(momentaryPosition, roomId, bookingStartTime);
      } else {
        // Reset position if dragged outside the allowed rows
        setDraggedBooking({
          old: { id: "", startTime: "", endTime: "", roomId: "" },
          new: { id: "", startTime: "", endTime: "", roomId: "" },
        });
        setShowDragConfirmModal(false);
      }
    }
  };

  const roomIds = data?.rooms.map((room: any) => room.id) || [];

  return (
    <div className="relative mt-8 w-full">
      <div className="grid grid-cols-[120px_auto] mb-1">
        <div className="col-start-2 grid grid-flow-col auto-cols-min">
          {timeIntervals.map((item, index) => (
            <div
              key={index + "time-interval"}
              className="w-[360px] border-l-2 border-kb-secondary relative"
            >
              <p className="ml-1 text-kb-primary inline-block">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full">
        {data?.rooms?.map((room: any, roomIndex: any) => (
          <div
            key={room.id}
            className="relative w-fullgrid grid-cols-[120px_1fr] mb-1"
          >
            <div
              className={`h-[${roomHeight}px] w-[120px] rounded-tl-md rounded-bl-md text-xs bg-kb-primary text-white pl-2 flex items-center font-semibold fixed left-[230px]`}
              style={{ zIndex: 30 }}
            >
              {room.name}
            </div>
            <div className="left-[120px] col-start-2 grid grid-flow-col auto-cols-min relative">
              {Array.from(
                {
                  length: calculateNumberOfFiveMinuteIntervals(
                    startHour,
                    endHour
                  ),
                },
                (_, index) => {
                  const currentTime = DateTime.fromFormat(startHour, "HH:mm", {
                    zone: "utc",
                  }).plus({ minutes: index * 5 });
                  const currentTimeISO = currentTime.toFormat("HH:mm");

                  const roomBookings = room?.bookings || [];

                  const isDisabled = roomBookings.some((booking: any) => {
                    const bookingStart = DateTime.fromISO(booking.startTime, {
                      zone: "utc",
                    })
                    const bookingEnd = DateTime.fromISO(booking.endTime, {
                      zone: "utc",
                    }).plus({ minutes: 5 });
                    const boxTime = DateTime.fromFormat(
                      `${currentDate}T${currentTimeISO}`,
                      "yyyy-MM-dd'T'HH:mm",
                      { zone: "utc" }
                    );

                    return boxTime >= bookingStart && boxTime < bookingEnd;
                  });

                  return (
                    <div
                      key={index + "disabled"}
                      className={`w-[30px] h-[35px] border-l border-t border-b border-r-none border-slate-300 ${
                        isDisabled
                          ? "bg-gray-200 pointer-events-none"
                          : "hover:border-r hover:border-kb-primary hover:cursor-pointer hover:duration-75 transition-all"
                      } relative group`}
                      data-time={currentTimeISO}
                      onClick={() => {
                        if (!isDisabled) {
                          handleBoxClick(currentTimeISO, room?.id, room?.name);
                        }
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {currentTimeISO}
                      </div>
                    </div>
                  );
                }
              )}

              {room?.bookings?.map((booking: any, bookingIndex: any) => {
                const startTime = DateTime.fromISO(booking.startTime, {
                  zone: "utc",
                });
                const endTime = DateTime.fromISO(booking.endTime, {
                  zone: "utc",
                });

                const left = calculateLeftPosition(
                  booking.startTime,
                  startHour
                );

                const durationInMinutes = endTime.diff(
                  startTime,
                  "minutes"
                ).minutes;
                const width = (durationInMinutes / 5) * 30;

                return (
                  <Booking
                    key={booking.id + "-" + roomIndex}
                    index={booking.id + "-" + roomIndex}
                    booking={booking}
                    left={left}
                    boxWidth={30}
                    handleDrag={(momentaryPosition) =>
                      handleDrag(momentaryPosition, room.id, booking.startTime)
                    }
                    resetPosition={resetPosition}
                    setDraggedBooking={setDraggedBooking}
                    setShowDragConfirmModal={setShowDragConfirmModal}
                    cancelDrag={cancelDrag}
                    startHour={startHour}
                    roomIds={roomIds} // Pass roomIds to the Booking component
                    roomHeight={roomHeight} // Pass roomHeight to the Booking component
                  >
                    <div
                      key={booking.id}
                      className={`absolute rounded-full text-xs text-white flex items-center justify-between px-4 border h-[35px] shadow-sm cursor-pointer handle left-[${left}px] ${
                        selectedBooking === booking
                          ? "bg-blue-500"
                          : "bg-kb-secondary"
                      }`}
                      style={{
                        width: `${width}px`,
                        zIndex: 15, // Ensure the booking is above the boxes
                      }}
                      onClick={(e) => handleBookingClick(booking, room)}
                    >
                      {startTime.toFormat("HH:mm")} -{" "}
                      {endTime.toFormat("HH:mm")}
                      <p className="font-semibold">
                        {booking?.user?.firstName} {booking?.user?.lastName}
                      </p>
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
