import React, { useState, useEffect } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { DateTime } from "luxon";

interface BookingProps {
  booking: {
    id: string;
    roomId: string;
    startTime: string;
    endTime: string;
    [key: string]: any;
  };
  index: string;
  children: React.ReactNode;
  left: number;
  boxWidth: number;
  handleDrag: (
    momentaryPosition: { x: number; y: number },
    roomId: string,
    bookingStartTime: string
  ) => any;
  setDraggedBooking: (booking: { old: any; new: any }) => void;
  setShowDragConfirmModal: (show: boolean) => void;
  cancelDrag: boolean;
  resetPosition: boolean;
  startHour: string;
  roomIds: string[];
  roomHeight: number;
}

const Booking: React.FC<BookingProps> = ({
  booking,
  index,
  children,
  left,
  boxWidth,
  handleDrag,
  setDraggedBooking,
  setShowDragConfirmModal,
  cancelDrag,
  resetPosition,
  startHour,
  roomIds,
  roomHeight,
}) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: left,
    y: 0,
  });
  const [initialPosition, setInitialPosition] = useState<{
    x: number;
    y: number;
  }>({ x: left, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [yAdjusted, setYAdjusted] = useState<boolean>(false);

  useEffect(() => {
    if (cancelDrag || resetPosition) {
      setPosition(initialPosition);
      setYAdjusted(false);
    }
  }, [cancelDrag, resetPosition, initialPosition]);

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

  // Add this useEffect to update the position when startTime or endTime changes
  useEffect(() => {
    const newLeft = calculateLeftPosition(booking.startTime, startHour);
    setPosition({ x: newLeft, y: position.y });
    setInitialPosition({ x: newLeft, y: position.y });
  }, [booking.startTime, booking.endTime, startHour]);

  const handleStart = () => {
    setInitialPosition(position);
    setIsDragging(false);
    setYAdjusted(false);
  };

  const handleDragEvent = (e: DraggableEvent, data: DraggableData) => {
    setIsDragging(true);
    setPosition({
      x: position.x + data.deltaX,
      y: initialPosition.y, // Keep y position constant to prevent vertical dragging
    });
  };

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    const snappedX = Math.round(position.x / boxWidth) * boxWidth;
    const snappedY = Math.round(position.y / roomHeight) * roomHeight;
    const newPosition = { x: snappedX, y: snappedY };
    setPosition(newPosition);

    if (isDragging) {
      try {
        if (!startHour || typeof startHour !== "string") {
          throw new Error(`Invalid startHour: ${startHour}`);
        }

        const originalStartTime = DateTime.fromISO(booking.startTime, {
          zone: "utc",
        });
        const initialGridUnits = Math.round(initialPosition.x / boxWidth);
        const newGridUnits = Math.round(snappedX / boxWidth);
        const gridUnitsMoved = newGridUnits - initialGridUnits;
        const newMinutesFromOriginal = gridUnitsMoved * 5;
        const newStartTime = originalStartTime
          .plus({ minutes: newMinutesFromOriginal })
          .toFormat("HH:mm");

        let newRoomIndex = Math.round(snappedY / roomHeight);

        if (newRoomIndex < 0) newRoomIndex = 0;
        if (newRoomIndex >= roomIds.length) newRoomIndex = roomIds.length - 1;

        const newRoomId =
          newRoomIndex === Math.round(initialPosition.y / roomHeight)
            ? booking.roomId
            : roomIds[newRoomIndex];

        const newBooking = handleDrag(
          { x: newPosition.x, y: newPosition.y },
          newRoomId,
          newStartTime
        );

        setDraggedBooking({
          old: booking,
          new: { ...newBooking, startTime: newStartTime, roomId: newRoomId },
        });
        setShowDragConfirmModal(true);
      } catch (error) {
        console.error(
          "Error calculating new start time:",
          (error as Error).message
        );
      }
    }
  };

  return (
    <Draggable
      key={booking.id + "-" + index}
      position={position}
      grid={[boxWidth, roomHeight]}
      onStart={handleStart}
      onDrag={handleDragEvent}
      onStop={handleStop}
      axis="x"
    >
      {children}
    </Draggable>
  );
};

export default Booking;
