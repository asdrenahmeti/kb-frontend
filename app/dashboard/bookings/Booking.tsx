import React, { useState, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { DateTime } from 'luxon';

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
  resetPosition: boolean; // Add this prop to reset the position
  startHour: string;
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
  resetPosition, // Destructure this prop
  startHour
}) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: left,
    y: 0
  });
  const [initialPosition, setInitialPosition] = useState<{
    x: number;
    y: number;
  }>({ x: left, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (cancelDrag || resetPosition) {
      setPosition(initialPosition);
    }
  }, [cancelDrag, resetPosition, initialPosition]);

  const handleStart = () => {
    setInitialPosition(position);
    setIsDragging(false); // Reset dragging flag
  };

  const handleDragEvent = (e: DraggableEvent, data: DraggableData) => {
    setIsDragging(true); // Set dragging flag to true on drag
    setPosition({ x: position.x + data.deltaX, y: 0 });
  };

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    // Snap to nearest 30-pixel grid
    const snappedX = Math.round(position.x / boxWidth) * boxWidth;
    const newPosition = { x: snappedX, y: 0 };
    setPosition(newPosition);

    if (isDragging) {
      try {
        if (!startHour || typeof startHour !== 'string') {
          throw new Error(`Invalid startHour: ${startHour}`);
        }

        // Calculate the new start time relative to the booking's original start time
        const originalStartTime = DateTime.fromISO(booking.startTime, {
          zone: 'utc'
        });
        const initialGridUnits = Math.round(initialPosition.x / boxWidth);
        const newGridUnits = Math.round(snappedX / boxWidth);
        const gridUnitsMoved = newGridUnits - initialGridUnits;
        const newMinutesFromOriginal = gridUnitsMoved * 5;
        const newStartTime = originalStartTime
          .plus({ minutes: newMinutesFromOriginal })
          .toFormat('HH:mm');

        console.log('initialGridUnits:', initialGridUnits);
        console.log('newGridUnits:', newGridUnits);
        console.log('gridUnitsMoved:', gridUnitsMoved);
        console.log('newMinutesFromOriginal:', newMinutesFromOriginal);
        console.log('newStartTime:', newStartTime);

        const newBooking = handleDrag(
          { x: newPosition.x, y: 0 },
          booking.roomId,
          newStartTime
        );

        setDraggedBooking({
          old: booking,
          new: { ...newBooking, startTime: newStartTime }
        });
        setShowDragConfirmModal(true);
      } catch (error) {
        console.error(
          'Error calculating new start time:',
          (error as Error).message
        );
      }
    }
  };

  return (
    <Draggable
      key={booking.id + '-' + index}
      position={position}
      axis='x'
      grid={[boxWidth, 30]}
      onStart={handleStart}
      onDrag={handleDragEvent}
      onStop={handleStop}
    >
      {children}
    </Draggable>
  );
};

export default Booking;
