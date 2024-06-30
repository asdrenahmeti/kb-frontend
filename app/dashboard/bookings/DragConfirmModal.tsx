import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DateTime } from 'luxon';

interface BookingData {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  roomId: string;
  [key: string]: any;
}

interface DragConfirmModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  oldBooking: BookingData;
  newBooking: { startTime: string; roomId: string; [key: string]: any };
  handleConfirm: (booking: BookingData) => void;
  handleCancel: () => void;
}

const DragConfirmModal: React.FC<DragConfirmModalProps> = ({
  showModal,
  setShowModal,
  oldBooking,
  newBooking,
  handleConfirm,
  handleCancel
}) => {
  const oldStartTime = DateTime.fromISO(oldBooking?.startTime);
  const oldEndTime = DateTime.fromISO(oldBooking?.endTime);
  const duration = oldEndTime.diff(oldStartTime, 'minutes').toObject().minutes;

  const newStartTime = DateTime.fromFormat(newBooking?.startTime, 'HH:mm');
  const newEndTime = newStartTime.plus({ minutes: duration }).toFormat('HH:mm');

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Booking Change</DialogTitle>
          <DialogDescription>
            <p className='mb-4'>
              Are you sure you want to change the booking from:
            </p>
            <div className='flex gap-2'>
              <p>
                <span className='font-medium text-black'>Start time:</span>{' '}
                {oldStartTime.toUTC().toFormat('HH:mm')}
              </p>
              -
              <p>
                <span className='font-medium text-black'>End time:</span>{' '}
                {oldEndTime.toUTC().toFormat('HH:mm')}
              </p>
            </div>
            <p className='my-2'>to:</p>
            <div className='flex gap-2'>
              <p>
                <span className='font-medium text-black'>Start time:</span>{' '}
                {newStartTime.toFormat('HH:mm')}
              </p>
              -
              <p>
                <span className='font-medium text-black'>End time:</span>{' '}
                {newEndTime}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() =>
              handleConfirm({
                ...newBooking,
                id: oldBooking?.id,
                date: oldBooking?.date,
                endTime: newEndTime,
                roomId: newBooking.roomId // Ensure the new roomId is included
              } as BookingData)
            }
          >
            Confirm
          </Button>
          <Button
            onClick={() => {
              handleCancel();
              setShowModal(false);
            }}
            variant='secondary'
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DragConfirmModal;
