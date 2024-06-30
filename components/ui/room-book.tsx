/* eslint-disable */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import Image from 'next/image';
import format from 'date-fns/format';
import { DateTime } from 'luxon';

type Props = {
  bookingModal: boolean;
  setBookingModal: (value: boolean) => void;
  roomId: any;
  booking: any;
};

type BookingData = {
  date: string;
  email: string;
  endTime: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roomId: string;
  startTime: string;
};

const fetchRoomData = async (roomId: any) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/rooms/${roomId}`
  );
  return data;
};

const createBooking = async (formData: BookingData) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/bookings`,
    formData
  );
  return response.data;
};

const RoomBookingModal = ({
  bookingModal,
  setBookingModal,
  roomId,
  booking
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange'
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      setBookingModal(false);
      toast.success('Booking successful!');
      reset();
    },
    onError: (error: AxiosError) => {
      toast.error(`Booking failed: ${error.message}`);
    }
  });

  const onSubmit = (data: any) => {
    const [hour, minute] = booking?.startTime.split(':');
    const [hourTime, minuteTime] = booking?.endTime?.split(':');

    const formattedStartTime =
      DateTime.fromObject({
        year: booking.date.getFullYear(),
        month: booking.date.getMonth() + 1,
        day: booking.date.getDate(),
        hour: parseInt(hour),
        minute: parseInt(minute)
      }).toISO({ includeOffset: false }) + 'Z';

    const formattedEndTime =
      DateTime.fromObject({
        year: booking.date.getFullYear(),
        month: booking.date.getMonth() + 1,
        day: booking.date.getDate(),
        hour: parseInt(hourTime),
        minute: parseInt(minuteTime)
      }).toISO({ includeOffset: false }) + 'Z';

    const bookingData: BookingData = {
      date: booking.date,
      email: data.email,
      endTime: formattedEndTime,
      firstName: data.firstName,
      lastName: data.surname,
      phoneNumber: data.phoneNumber,
      roomId: roomId,
      startTime: formattedStartTime
    };

    mutation.mutate(bookingData);
  };

  const {
    data: roomData,
    error,
    isLoading
  } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => fetchRoomData(roomId)
  });

  return (
    <>
      {bookingModal && (
        <Dialog
          open={bookingModal}
          onOpenChange={() => setBookingModal(!bookingModal)}
        >
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className='sm:max-w-[800px] grid grid-cols-2'>
            <div>
              <DialogHeader>
                <DialogTitle>Customer Information</DialogTitle>
              </DialogHeader>
              <form className='mt-4' onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-2'>
                  <Label htmlFor='firstName'>First Name</Label>
                  <Input
                    id='firstName'
                    type='text'
                    placeholder='Name'
                    {...register('firstName', { required: true })}
                  />
                  {errors.firstName && (
                    <p className='text-red-500'>First Name is required</p>
                  )}
                </div>
                <div className='mb-2'>
                  <Label htmlFor='surname'>Surname</Label>
                  <Input
                    id='surname'
                    type='text'
                    placeholder='Surname'
                    {...register('surname', { required: true })}
                  />
                  {errors.surname && (
                    <p className='text-red-500'>Surname is required</p>
                  )}
                </div>
                <div className='mb-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='Email'
                    {...register('email', { required: true })}
                  />
                  {errors.email && (
                    <p className='text-red-500'>Email is required</p>
                  )}
                </div>
                <div className='mb-2'>
                  <Label htmlFor='phoneNumber'>Phone Number</Label>
                  <Input
                    id='phoneNumber'
                    type='text'
                    placeholder='Phone Number'
                    {...register('phoneNumber', { required: true })}
                  />
                  {errors.phoneNumber && (
                    <p className='text-red-500'>Phone Number is required</p>
                  )}
                </div>
                <Button type='submit' className='mt-4' disabled={!isValid}>
                  Submit
                </Button>
              </form>
            </div>
            <div className='flex flex-col justify-end items-end'>
              {roomData && (
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/public/room-images/${roomData?.image}`}
                  alt='Room Image'
                  className='mt-4 rounded-br-3xl rounded-tl-3xl'
                />
              )}
              <h1 className='mt-4 text-2xl font-bold'>{roomData?.name}</h1>
              <p>{format(new Date(booking?.date), 'EEE, MMM dd, yyyy')}</p>
              <p>
                Start time: <strong> {booking?.startTime} </strong>
              </p>
              <p>
                End time: <strong> {booking?.endTime} </strong>
              </p>
              <p>
                Capacity: <strong> {roomData?.capacity} </strong>
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RoomBookingModal;
