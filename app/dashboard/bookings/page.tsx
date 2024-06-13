'use client';

import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon, PanelBottomOpen, PanelTopOpen } from 'lucide-react';
import { format } from 'date-fns';
import CurrentTimeLine from './CurrentTimeLine';
import BookingGrid from './BookingGrid';
import AddBooking from './AddBooking';
import DragConfirmModal from './DragConfirmModal';
import { toast } from 'sonner';

interface BookingData {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  [key: string]: any;
}

interface NewBookingData {
  startTime: string;
  roomId: string;
  [key: string]: any;
}

interface Site {
  id: string;
  name: string;
}

const calculateScrollPosition = (
  startHour: string,
  currentTime: DateTime
): number => {
  const startTime = DateTime.fromFormat(startHour, 'HH:mm');
  const targetTime = currentTime.minus({ hours: 1 });

  // Calculate difference in minutes from start time to target time
  const diffInMinutes = targetTime.diff(startTime, 'minutes').minutes;
  const scrollPosition = (diffInMinutes / 5) * 30; // 30px per 5-minute interval

  return scrollPosition;
};

const Page: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [startHour, setStartHour] = useState<string>('');
  const [endHour, setEndHour] = useState<string>('');
  const [bookingModal, setBookingModal] = useState<boolean>(false);
  const [newBooking, setNewBooking] = useState<NewBookingData | null>(null);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [draggedBooking, setDraggedBooking] = useState<any>(null);
  const [showDragConfirmModal, setShowDragConfirmModal] =
    useState<boolean>(false);
  const [cancelDrag, setCancelDrag] = useState<boolean>(false);
  const [resetPosition, setResetPosition] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    onSuccess: res => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
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
    },
    mutationFn: ({ id, ...booking }: BookingData) => {
      return axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${id}`,
        booking
      );
    }
  });

  const handleConfirmDrag = (newBooking: any) => {
    setShowDragConfirmModal(false);
    setCancelDrag(false);
    setResetPosition(false);

    const { id, date, startTime, endTime, ...rest } = newBooking;

    // Parse startTime and endTime
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');

    // Format startTime and endTime to the required format
    const formattedStartTime = DateTime.fromObject(
      {
        year: new Date(date).getFullYear(),
        month: new Date(date).getMonth() + 1,
        day: new Date(date).getDate(),
        hour: parseInt(startHour),
        minute: parseInt(startMinute)
      },
      { zone: 'utc' }
    ).toISO();

    const formattedEndTime = DateTime.fromObject(
      {
        year: new Date(date).getFullYear(),
        month: new Date(date).getMonth() + 1,
        day: new Date(date).getDate(),
        hour: parseInt(endHour),
        minute: parseInt(endMinute)
      },
      { zone: 'utc' }
    ).toISO();

    const formattedBooking: BookingData = {
      id,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      date,
      ...rest
    };

    mutation.mutate(formattedBooking);
  };

  const handleCloseModal = () => {
    setShowDragConfirmModal(false);
    // Trigger repositioning the booking to its initial position
    setCancelDrag(true);
    setResetPosition(true);
    setTimeout(() => {
      setResetPosition(false); // Reset the position state after the animation is complete
    }, 300);
  };

  const fetchData = async (): Promise<any> => {
    if (!date || !selectedSite) return;

    const isoDateString =
      DateTime.fromObject({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: 0,
        minute: 0,
        second: 0
      }).toISO({ includeOffset: false }) + 'Z';

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings?gt=${isoDateString}&siteId=${selectedSite}`
      );
      const data = res.data;
      setStartHour(data?.openingHours);
      setEndHour(data?.closingHours);
      return data;
    } catch (error) {
      console.error('Error fetching bookings data:', error);
      return null;
    }
  };

  const { data, isFetching } = useQuery({
    queryKey: ['bookings', date, selectedSite],
    queryFn: fetchData,
    enabled: !!selectedSite && !!date
  });

  const { data: sitesData } = useQuery({
    queryKey: ['sites'],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sites`)
        .then(res => res.data)
  });

  const handleBoxClick = (time: string, roomId: string, roomName: string) => {
    const selectedDateTime = DateTime.fromFormat(time, 'HH:mm', {
      zone: 'utc'
    });
    const endDateTime = DateTime.fromFormat(endHour, 'HH:mm', { zone: 'utc' });
    const selectedDate =
      (selectedDateTime.hour < endDateTime.hour &&
        selectedDateTime.hour >=
          DateTime.fromFormat(startHour, 'HH:mm', { zone: 'utc' }).hour) ||
      (selectedDateTime.hour >= endDateTime.hour &&
        endDateTime.hour <
          DateTime.fromFormat(startHour, 'HH:mm', { zone: 'utc' }).hour)
        ? date
        : DateTime.fromISO(date as unknown as string)
            .plus({ days: 1 })
            .toISODate();
    const newBooking = {
      date: selectedDate,
      startTime: selectedDateTime.toFormat('HH:mm'),
      roomId: roomId,
      roomName: roomName
    };

    setNewBooking(newBooking);
    setBookingModal(true);
  };

  const handleBoxDrag = (
    momentaryPosition: { x: number; y: number },
    roomId: string,
    bookingStartTime: string
  ) => {
    const timeIntervalInMinutes = 5; // Each box represents a 5-minute interval
    const boxWidth = 30; // Each box is 30px wide

    // Calculate the initial left position based on the booking start time
    const startDateTime = DateTime.fromFormat(startHour, 'HH:mm', {
      zone: 'utc'
    });
    const bookingStartDateTime = DateTime.fromISO(bookingStartTime, {
      zone: 'utc'
    });

    const initialMinutesFromStart = bookingStartDateTime.diff(
      startDateTime,
      'minutes'
    ).minutes;
    const initialLeft =
      (initialMinutesFromStart / timeIntervalInMinutes) * boxWidth;

    console.log('Initial Minutes from Start:', initialMinutesFromStart);
    console.log('Initial Left Position:', initialLeft);

    const relativePositionX = momentaryPosition.x;
    console.log('Relative Position X:', relativePositionX);

    const totalMinutesFromStart =
      initialMinutesFromStart +
      (relativePositionX / boxWidth) * timeIntervalInMinutes;
    console.log('Total Minutes from Start:', totalMinutesFromStart);

    const momentaryTime = startDateTime.plus({
      minutes: totalMinutesFromStart
    });

    const endDateTime = DateTime.fromFormat(endHour, 'HH:mm', { zone: 'utc' });

    const selectedDate =
      (momentaryTime.hour < endDateTime.hour &&
        momentaryTime.hour >= startDateTime.hour) ||
      (momentaryTime.hour >= endDateTime.hour &&
        endDateTime.hour < startDateTime.hour)
        ? DateTime.fromJSDate(date as Date).toISODate()
        : DateTime.fromJSDate(date as Date)
            .plus({ days: 1 })
            .toISODate();

    const newBooking = {
      date: selectedDate,
      startTime: momentaryTime.toFormat('HH:mm'),
      roomId: roomId
    };

    setDraggedBooking({
      old: {
        id: '',
        startTime: bookingStartTime,
        endTime: '',
        date: selectedDate
      },
      new: newBooking
    });
    setShowDragConfirmModal(true);

    return newBooking;
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
  }, [date, selectedSite]);

  useEffect(() => {
    if (startHour && endHour) {
      const currentTime = DateTime.local();
      const scrollPosition = calculateScrollPosition(startHour, currentTime);
      const container = document.querySelector('.w-full.overflow-auto'); // Adjust selector as needed
      if (container) {
        container.scrollLeft = scrollPosition;
      }
    }
  }, [startHour, endHour]);

  useEffect(() => {
    if (activeBooking) {
      setIsCollapsed(false);
    }
  }, [activeBooking]);

  return (
    <>
      <div className='relative h-full'>
        <h1 className='text-2xl font-medium mb-4'>Bookings</h1>
        <div className='flex gap-4 mb-4'>
          <Select onValueChange={item => setSelectedSite(item)}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select a site' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sitesData?.map((item: Site, index: number) => (
                  <SelectItem value={item.id} key={index}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[280px] justify-start text-left font-normal',
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
        </div>

        <div className='w-full overflow-auto relative'>
          {selectedSite && (
            <>
              <CurrentTimeLine startHour={startHour} />
              <BookingGrid
                data={data}
                startHour={startHour}
                endHour={endHour}
                handleBoxClick={handleBoxClick}
                handleBoxDrag={handleBoxDrag}
                setActiveBooking={setActiveBooking}
                setDraggedBooking={setDraggedBooking}
                setShowDragConfirmModal={setShowDragConfirmModal}
                cancelDrag={cancelDrag}
                resetPosition={resetPosition} // Pass resetPosition prop
              />
            </>
          )}
        </div>

        <div
          className={`p-4 w-full shadow-xl border-[1px] border-black/10 absolute bottom-0 overflow-hidden rounded-tl-xl rounded-tr-xl transition-height duration-300 ${
            isCollapsed ? 'h-[50px]' : 'h-[180px]'
          }`}
        >
          <div className='flex justify-between items-center mb-2'>
            <p className='font-medium'>
              {activeBooking
                ? 'Active Selected Booking' + ` - ${activeBooking?.booking?.id}`
                : 'No Active Booking'}
            </p>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className='text-blue-500'
            >
              {isCollapsed ? (
                <PanelBottomOpen color='black' />
              ) : (
                <PanelTopOpen color='black' />
              )}
            </button>
          </div>
          {!isCollapsed && activeBooking && (
            <div className='grid grid-cols-2'>
              <div className='col-span-1'>
                <div className='flex gap-4'>
                  <p className='font-medium min-w-[100px]'>Booking ID:</p>
                  <p className='font-light'>{activeBooking?.booking?.id}</p>
                </div>
                <div className='flex gap-4'>
                  <p className='font-medium min-w-[100px]'>User:</p>
                  <p className='font-light'>User 1</p>
                </div>
                <div className='flex gap-4'>
                  <p className='font-medium min-w-[100px]'>Status</p>
                  <p className='font-light'>{activeBooking?.booking?.status}</p>
                </div>
                <div className='flex gap-4'>
                  <p className='font-medium min-w-[100px]'>Start time</p>
                  <p className='font-light'>
                    {DateTime.fromISO(activeBooking?.booking?.startTime)
                      .toUTC()
                      .toFormat('HH:mm')}
                  </p>
                </div>
                <div className='flex gap-4'>
                  <p className='font-medium min-w-[100px]'>End time</p>
                  <p className='font-light'>
                    {DateTime.fromISO(activeBooking?.booking?.endTime)
                      .toUTC()
                      .toFormat('HH:mm')}
                  </p>
                </div>
              </div>
              <div className='col-span-1'>
                <div className='flex gap-4'>
                  <p className='font-medium min-w-[100px]'>Room:</p>
                  <p className='font-light'>{activeBooking?.room?.name}</p>
                </div>
                <div className='flex gap-4'>
                  <p className='font-medium min-w-[100px]'>Capacity:</p>
                  <p className='font-light'>{activeBooking?.room?.capacity}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {showDragConfirmModal && draggedBooking && (
          <DragConfirmModal
            showModal={showDragConfirmModal}
            setShowModal={setShowDragConfirmModal}
            oldBooking={draggedBooking.old}
            newBooking={draggedBooking.new}
            handleConfirm={handleConfirmDrag}
            handleCancel={handleCloseModal} // Pass handleCloseModal to handleCancel prop
          />
        )}

        {bookingModal && (
          <AddBooking
            bookingModal={bookingModal}
            setBookingModal={setBookingModal}
            booking={newBooking}
          />
        )}
      </div>
    </>
  );
};

export default Page;
