// app/components/BookingForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './select';
import { Button } from './button';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from './calendar';
import { CalendarIcon } from 'lucide-react';
import { DateTime } from 'luxon';
import Room from './room';
import RoomBooking from './room-book';
import RoomBookingModal from './room-book';

type FormData = {
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  persons: string;
};

type Booking = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  roomId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: any;
  menu_orders: any[];
};

type Room = {
  slots: any;
  id: string;
  name: string;
  image: string;
  capacity: number;
  available: boolean;
  pricing: any;
  siteId: string;
  createdAt: string;
  updatedAt: string;
  bookings: Booking[];
};

const generateTimeOptions = (start: string, end: string) => {
  const times = [];
  const startHour = parseInt(start.split(':')[0], 10);
  const endHour = parseInt(end.split(':')[0], 10);
  for (let i = startHour; i !== endHour; i = (i + 1) % 24) {
    const hourString = `${i < 10 ? '0' : ''}${i}:00`;
    times.push(hourString);
  }
  return times;
};

const BookingForm: React.FC = () => {
  const [selectedSite, setSelectedSite] = useState<any | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTimeOptions, setStartTimeOptions] = useState<string[]>([]);
  const [endTimeOptions, setEndTimeOptions] = useState<string[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [bookingModal, setBookingModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({ mode: 'onChange' });

  useEffect(() => {
    if (selectedRoom) {
      setBookingModal(true);
    } else {
      setBookingModal(false);
    }
  }, [selectedRoom]);

  const selectedSite2 = watch('venue');

  const { data: sites = [] } = useQuery({
    queryKey: ['sites'],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sites`)
        .then(res => res.data)
  });

  const selectedStartTime = watch('startTime');
  const selectedEndTime = watch('endTime');

  useEffect(() => {
    if (selectedSite) {
      const site = sites.find((site: any) => site.id === selectedSite);
      const openingHours = site.openingHours;
      const closingHours = site.closingHours;

      const times = generateTimeOptions(openingHours, closingHours);
      setStartTimeOptions(times);
      setEndTimeOptions(times);
      setValue('startTime', '');
      setValue('endTime', '');
    }
  }, [selectedSite, sites, setValue]);

  useEffect(() => {
    if (selectedStartTime && selectedSite) {
      const site = sites.find((site: any) => site.id === selectedSite);
      const closingHours = site.closingHours;

      const startHour = parseInt(selectedStartTime.split(':')[0], 10);
      const closingHour = parseInt(closingHours.split(':')[0], 10);
      const endTimes = [];
      for (let i = (startHour + 1) % 24; i !== closingHour; i = (i + 1) % 24) {
        const hourString = `${i < 10 ? '0' : ''}${i}:00`;
        endTimes.push(hourString);
      }
      setEndTimeOptions(endTimes);
    }
  }, [selectedStartTime, selectedSite, sites]);

  const onSubmit = async (data: FormData) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings`,
      {
        params: {
          gt: format(date, 'yyyy-MM-dd'),
          siteId: selectedSite
        }
      }
    );

    const rooms = response.data.rooms as Room[];
    const selectedDate = format(date, 'yyyy-MM-dd');
    const selectedStart = DateTime.fromISO(
      `${selectedDate}T${data.startTime}`,
      { zone: 'utc' }
    ).toLocal();
    const selectedEnd = DateTime.fromISO(`${selectedDate}T${data.endTime}`, {
      zone: 'utc'
    }).toLocal();

    const filteredRooms = rooms.filter(room => {
      const validBookings = room.bookings.filter(
        booking => booking.startTime && booking.endTime
      );

      return validBookings.every(booking => {
        const bookingStartTime = DateTime.fromISO(booking.startTime, {
          zone: 'utc'
        }).toLocal();
        const bookingEndTime = DateTime.fromISO(booking.endTime, {
          zone: 'utc'
        }).toLocal();

        return (
          selectedEnd <= bookingStartTime || selectedStart >= bookingEndTime
        );
      });
    });

    setAvailableRooms(filteredRooms);
  };

  return (
    <div className='mb-8'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='relative -top-[50px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-12 items-center justify-between bg-white px-6 py-8 rounded-lg shadow-md max-w-7xl mx-auto '
      >
        <div className='flex flex-col'>
          <label className='text-black mb-2 font-semibold'>Select Venue</label>
          <Select
            {...register('venue', { required: 'Venue is required' })}
            onValueChange={item => {
              setSelectedSite(item);
              setValue('venue', item);
            }}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a choice' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sites.map((item: any, index: number) => (
                  <SelectItem value={item.id} key={index}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {errors.venue && (
            <span className='text-red-500'>{errors.venue.message}</span>
          )}
        </div>

        <div className='flex flex-col'>
          <label className='text-black mb-2 font-semibold'>Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <span className='text-red-500'>{errors.date.message}</span>
          )}
        </div>

        <div className='flex flex-col'>
          <label className='text-black mb-2 font-semibold'>Start Time</label>
          <Select
            {...register('startTime', { required: 'Start time is required' })}
            onValueChange={value => setValue('startTime', value)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select start time' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {startTimeOptions.map((time, index) => (
                  <SelectItem value={time} key={index}>
                    {time}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.startTime && (
            <span className='text-red-500'>{errors.startTime.message}</span>
          )}
        </div>

        <div className='flex flex-col'>
          <label className='text-black mb-2 font-semibold'>End Time</label>
          <Select
            {...register('endTime', { required: 'End time is required' })}
            onValueChange={value => setValue('endTime', value)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select end time' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {endTimeOptions.map((time, index) => (
                  <SelectItem value={time} key={index}>
                    {time}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.endTime && (
            <span className='text-red-500'>{errors.endTime.message}</span>
          )}
        </div>

        <div className='flex flex-col'>
          <label className='text-black mb-2 font-semibold'>Persons</label>
          <Select
            {...register('persons', {
              required: 'Number of persons is required'
            })}
            onValueChange={value => setValue('persons', value)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a choice' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={'1-11'}>1-11</SelectItem>
                <SelectItem value={'12-15'}>12-15</SelectItem>
                <SelectItem value={'16-21'}>16-21</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.persons && (
            <span className='text-red-500'>{errors.persons.message}</span>
          )}
        </div>

        <div className='flex items-end'>
          <Button
            type='submit'
            className='bg-kb-primary w-full mt-7 hover:bg-kb-secondary'
            disabled={selectedSite === ''}
          >
            Search
          </Button>
        </div>
      </form>

      <div className='mt-8 max-w-[1200px] mx-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-auto gap-8'>
          {availableRooms.length > 0 ? (
            <>
              {availableRooms.map(room => (
                <Room
                  id={room.id}
                  key={room.id}
                  imageUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/public/room-images/${room.image}`}
                  roomName={room.name}
                  capacity={room.capacity}
                  price={room.slots}
                  setSelectedRoom={setSelectedRoom}
                ></Room>
              ))}
            </>
          ) : (
            <p className='text-center col-span-3 w-full text-white'>
              No rooms available for the selected time.
            </p>
          )}
        </div>
      </div>

      {bookingModal && (
        <RoomBookingModal
          setBookingModal={setBookingModal}
          roomId={selectedRoom}
          bookingModal={bookingModal}
          booking={{
            startTime: selectedStartTime,
            endTime: selectedEndTime,
            date: date
          }}
        />
      )}
    </div>
  );
};

export default BookingForm;
