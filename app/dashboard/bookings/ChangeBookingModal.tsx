import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { DateTime } from 'luxon';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import { useSession } from 'next-auth/react';

interface ChangeBookingModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setActiveBooking: (booking: any) => void;
  booking: any;
}

const ChangeBookingModal: React.FC<ChangeBookingModalProps> = ({
  showModal,
  setShowModal,
  setActiveBooking,
  booking
}) => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();

  const [startTime, setStartTime] = useState(
    booking?.startTime ? booking.startTime.substring(11, 16) : ''
  );
  const [endTime, setEndTime] = useState(
    booking?.endTime ? booking.endTime.substring(11, 16) : ''
  );
  const [date, setDate] = useState<Date | undefined>(new Date(booking?.date));
  const [room, setRoom] = useState(booking?.roomId || '');

  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/rooms`);
      return response.data;
    }
  });

  const mutation = useMutation({
    mutationFn: ({
      id,
      startTime,
      endTime,
      date,
      roomId,
      userId
    }: {
      id: string;
      startTime: string;
      endTime: string;
      date: string;
      roomId: string;
      userId: string
    }) => {
      return axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${id}`, {
        startTime,
        endTime,
        date,
        roomId,
        userId
      });
    },
    onSuccess: res => {
      setActiveBooking(null);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking updated successfully');
    },
    onError: error => {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `${(error?.response?.data as { message?: string })?.message}`,
          {
            position: 'top-center'
          }
        );
      } else {
        console.error('An error occurred:', error.message);
      }
    }
  });

  const handleSubmit = () => {
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');

    const formattedStartTime =
      DateTime.fromObject({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: parseInt(startHour),
        minute: parseInt(startMinute)
      }).toISO({ includeOffset: false }) + 'Z';

    const formattedEndTime =
      DateTime.fromObject({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: parseInt(endHour),
        minute: parseInt(endMinute)
      }).toISO({ includeOffset: false }) + 'Z';

    const updatedBooking = {
      id: booking.id,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      date:
        DateTime.fromJSDate(date)
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .toISO({ includeOffset: false }) + 'Z',
      roomId: room,
      userId: session?.user?.id
    };

    mutation.mutate(updatedBooking);
    setShowModal(false);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Booking</DialogTitle>
          <DialogDescription>Update the booking details</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='startTime' className='text-left'>
              Start Time
            </label>
            <Input
              id='startTime'
              type='time'
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              placeholder='--:--'
              className='col-span-3 focus:outline-none focus:ring-0'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='endTime' className='text-left'>
              End Time
            </label>
            <Input
              id='endTime'
              type='time'
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              placeholder='--:--'
              className='col-span-3 focus:outline-none focus:ring-0'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='date' className='text-left'>
              Date
            </label>
            <Calendar
              mode='single'
              selected={date}
              onSelect={setDate}
              initialFocus
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='room' className='text-left'>
              Room
            </label>
            <Select onValueChange={setRoom} value={room}>
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Select a room' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {rooms?.map((room: any) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
          <Button onClick={() => setShowModal(false)} variant='secondary'>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeBookingModal;