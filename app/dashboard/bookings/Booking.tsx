import React, { useState, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

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
    roomId: string
  ) => any;
  setDraggedBooking: (booking: { old: any; new: any }) => void;
  setShowDragConfirmModal: (show: boolean) => void;
  cancelDrag: boolean;
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
  cancelDrag
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
    if (cancelDrag) {
      setPosition(initialPosition);
    }
  }, [cancelDrag, initialPosition]);

  const handleStart = () => {
    setInitialPosition(position);
    setIsDragging(false); // Reset dragging flag
  };

  const handleDragEvent = (e: DraggableEvent, data: DraggableData) => {
    setIsDragging(true); // Set dragging flag to true on drag
    setPosition({ x: position.x + data.deltaX, y: 0 });
  };

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    const newPosition = {
      x: Math.round(position.x / boxWidth) * boxWidth,
      y: 0
    };
    setPosition(newPosition);

    if (isDragging) {
      const momentaryPosition = { x: newPosition.x, y: 0 };
      const newBooking = handleDrag(momentaryPosition, booking.roomId);

      setDraggedBooking({ old: booking, new: newBooking });
      setShowDragConfirmModal(true);
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
