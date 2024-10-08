/* eslint-disable */

import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
const { DateTime } = require('luxon');

type Props = {
  bookingModal: boolean;
  setBookingModal: (value: boolean) => void;
  booking: any;
  site: any;
  date: any;
};

const AddBooking = ({
  bookingModal,
  setBookingModal,
  booking,
  site,
  date
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm();

  const queryClient = useQueryClient();

  const [selectedItems, setSelectedItems] = useState<
    { menu_id: number; quantity: number }[]
  >([]);
  const [email, setEmail] = useState('');
  const [userSearchResult, setUserSearchResult] = useState(null);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors }
  } = useForm();

  const {
    isPending,
    error,
    data: menu = [],
    isFetching: menuFetching
  } = useQuery({
    queryKey: ['menus'],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/menus/site/${site}`)
        .then(res => res.data)
  });

  const bookingMutation = useMutation({
    onSuccess: res => {
      reset();
      queryClient.invalidateQueries({
        queryKey: ['room', booking.roomId]
      });
      queryClient.invalidateQueries({
        queryKey: ['bookings']
      });
      toast.success(`Successfully arranged a new booking`, {
        position: 'top-center'
      });

      setBookingModal(false);
    },
    onError: (error: AxiosError) => {
      if (error.response) {
        toast.error(
          `${(error?.response?.data as { message?: string })?.message}`,
          {
            position: 'top-center'
          }
        );
      } else {
        toast.error('An error occurred while creating booking', {
          position: 'top-center'
        });
      }
    },
    mutationFn: booking => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings`,
        booking
      );
    }
  });

  const handleAddItem = (menu_id: number) => {
    setSelectedItems(prevItems => {
      const existingItem = prevItems.find(item => item.menu_id === menu_id);
      if (existingItem) {
        return prevItems.map(item =>
          item.menu_id === menu_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { menu_id, quantity: 1 }];
    });
  };

  const handleRemoveItem = (menu_id: number) => {
    setSelectedItems(prevItems => {
      const existingItem = prevItems.find(item => item.menu_id === menu_id);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.menu_id === menu_id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevItems.filter(item => item.menu_id !== menu_id);
    });
  };

  const menuPrice = useMemo(() => {
    return selectedItems.reduce((total, selectedItem) => {
      const menuItem = menu.find(
        (item: any) => item.id === selectedItem.menu_id
      );
      return total + (menuItem ? menuItem.price * selectedItem.quantity : 0);
    }, 0);
  }, [selectedItems, menu]);

  const totalPrice = useMemo(() => {
    return (calculatedPrice || 0) + menuPrice;
  }, [calculatedPrice, menuPrice]);

  const calculatePrice = async (startTime: string, endTime: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/calculate-price`,
        {
          roomId: booking.roomId,
          startTime,
          endTime
        }
      );
      setCalculatedPrice(response.data);
    } catch (error) {
      toast.error('Failed to calculate price', {
        position: 'top-center'
      });
    }
  };

  const handleTimeChange = (startTime: string, endTime: string) => {
    calculatePrice(startTime, endTime);
  };

  useEffect(() => {
    const startTime = watch('startTime');
    const endTime = watch('endTime');
    if (startTime && endTime) {
      const [startHour, startMinute] = startTime.split(':');
      const [endHour, endMinute] = endTime.split(':');

      const bookingDate = new Date(booking.date); // Parse the date string into a Date object

      const formattedStartTime =
        DateTime.fromObject({
          year: bookingDate.getFullYear(),
          month: bookingDate.getMonth() + 1,
          day: bookingDate.getDate(),
          hour: parseInt(startHour),
          minute: parseInt(startMinute)
        }).toISO({ includeOffset: false }) + 'Z';

      let endDate = bookingDate;
      if (parseInt(endHour) < parseInt(startHour)) {
        endDate = new Date(bookingDate);
        endDate.setDate(endDate.getDate() + 1);
      }

      const formattedEndTime =
        DateTime.fromObject({
          year: endDate.getFullYear(),
          month: endDate.getMonth() + 1,
          day: endDate.getDate(),
          hour: parseInt(endHour),
          minute: parseInt(endMinute)
        }).toISO({ includeOffset: false }) + 'Z';

      handleTimeChange(formattedStartTime, formattedEndTime);
    }
  }, [watch('startTime'), watch('endTime')]);

  const onSubmit = async (formData: any) => {
    const startTime = formData.startTime;
    const [startHour, startMinute] = startTime.split(':');

    const bookingDate = new Date(booking.date); // Parse the date string into a Date object

    const formattedStartTime =
      DateTime.fromObject({
        year: bookingDate.getFullYear(),
        month: bookingDate.getMonth() + 1,
        day: bookingDate.getDate(),
        hour: parseInt(startHour),
        minute: parseInt(startMinute)
      }).toISO({ includeOffset: false }) + 'Z';

    const endTime = formData.endTime;
    const [endHour, endMinute] = endTime.split(':');

    let endDate = bookingDate;
    if (parseInt(endHour) < parseInt(startHour)) {
      endDate = new Date(bookingDate);
      endDate.setDate(endDate.getDate() + 1);
    }

    const formattedEndTime =
      DateTime.fromObject({
        year: endDate.getFullYear(),
        month: endDate.getMonth() + 1,
        day: endDate.getDate(),
        hour: parseInt(endHour),
        minute: parseInt(endMinute)
      }).toISO({ includeOffset: false }) + 'Z';

    bookingMutation.mutate({
      ...formData,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      roomId: booking.roomId,
      date:
        DateTime.fromJSDate(date)
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .toISO({ includeOffset: false }) + 'Z',
      menuOrders: selectedItems,
      email,
      phoneNumber: formData.phoneNumber,
      firstName: formData.firstName,
      lastName: formData.lastName
    });
  };

  const handleSearchEmail = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/email/${email}`
      );
      setUserSearchResult(response.data);
      setShowCreateUserForm(false);
    } catch (error) {
      toast.error('User not found', {
        position: 'top-center'
      });
      setUserSearchResult(null);
      setShowCreateUserForm(true);
    }
  };

  return (
    <>
      {bookingModal && (
        <Dialog
          open={bookingModal}
          onOpenChange={() => setBookingModal(!bookingModal)}
        >
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>Add a booking</DialogTitle>
              <DialogDescription>Fill booking information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='room_id' className='text-left'>
                    Room Name
                  </Label>
                  <p className='col-span-3 font-bold'>{booking?.roomName}</p>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='startTime' className='text-left'>
                    Start time
                  </Label>
                  <Input
                    {...register('startTime', { required: true })}
                    id='startTime'
                    placeholder='Write a site name'
                    className='col-span-3'
                    value={booking?.startTime}
                    readOnly
                  />

                  <Label htmlFor='name' className='text-left'>
                    End time
                  </Label>
                  <Input
                    {...register('endTime', { required: true })}
                    id='endTime'
                    placeholder='Set opening site hour'
                    className='col-span-3'
                    value={DateTime.fromFormat(booking?.startTime, 'HH:mm')
                      .plus({ hours: 1 })
                      .toFormat('HH:mm')}
                    readOnly
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='email' className='text-left'>
                    User
                  </Label>
                  <div className='col-span-3 flex items-center'>
                    <Input
                      id='email'
                      placeholder='Search user by email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className='flex-1'
                    />
                    <Button
                      type='button'
                      onClick={handleSearchEmail}
                      className='ml-2'
                      disabled={email.length === 0}
                    >
                      Search
                    </Button>
                  </div>
                </div>
                {userSearchResult && (
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='user_info' className='text-left'>
                      User Info
                    </Label>
                    <div className='col-span-3'>
                      <p>
                        <strong>ID:</strong>{' '}
                        {userSearchResult.id || 'not defined'}
                      </p>
                      <p>
                        <strong>Name:</strong>{' '}
                        {userSearchResult.firstName || 'not defined'}{' '}
                        {userSearchResult.lastName || 'not defined'}
                      </p>
                      <p>
                        <strong>Email:</strong> {userSearchResult.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {userSearchResult.phone_number}
                      </p>
                      {/* Display more user information as needed */}
                    </div>
                  </div>
                )}
                {showCreateUserForm && (
                  <div className='grid grid-cols-4 gap-4'>
                    <p className='col-span-4 text-sm text-red-500'>
                      User is not found, please proceed to create a new user
                    </p>
                    <div className='grid grid-cols-4 col-span-4 items-center gap-4'>
                      <Label htmlFor='phoneNumber' className='text-left'>
                        Phone Number
                      </Label>
                      <Input
                        {...register('phoneNumber', { required: true })}
                        id='phoneNumber'
                        placeholder='Enter phone number'
                        className='col-span-3'
                      />
                    </div>
                    <div className='grid grid-cols-4 col-span-4 items-center gap-4'>
                      <Label htmlFor='firstName' className='text-left'>
                        First Name
                      </Label>
                      <Input
                        {...register('firstName', { required: true })}
                        id='firstName'
                        placeholder='Enter first name'
                        className='col-span-3'
                      />
                    </div>
                    <div className='grid grid-cols-4 col-span-4 items-center gap-4'>
                      <Label htmlFor='lastName' className='text-left'>
                        Last Name
                      </Label>
                      <Input
                        {...register('lastName', { required: true })}
                        id='lastName'
                        placeholder='Enter last name'
                        className='col-span-3'
                      />
                    </div>
                  </div>
                )}
                <div className='grid grid-cols-4 gap-4'>
                  <Label htmlFor='room_id' className='text-left'>
                    Menu
                  </Label>
                  <div className='grid grid-cols-5 col-span-3'>
                    {menu.map((item: any, index: number) => {
                      const selectedItem = selectedItems.find(
                        selectedItem => selectedItem.menu_id === item.id
                      );
                      return (
                        <div
                          className='col-span-4 grid grid-cols-5 '
                          key={index}
                        >
                          <p className='col-span-2'>{item?.name}</p>
                          <p className='col-span-1 '>
                            {item?.item_type.toLowerCase()}
                          </p>
                          <p className='col-span-1 font-medium'>
                            {item?.price}£
                          </p>
                          <div className='col-span-1 flex items-center'>
                            {selectedItem ? (
                              <div className='flex items-center space-x-2'>
                                <button
                                  type='button'
                                  className='px-2 rounded-md text-sm mb-2 bg-kb-primary text-white'
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  -
                                </button>
                                <span>{selectedItem.quantity}</span>
                                <button
                                  type='button'
                                  className='px-2  rounded-md text-sm mb-2 bg-kb-primary text-white'
                                  onClick={() => handleAddItem(item.id)}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                type='button'
                                className='px-2 py-1 rounded-md text-sm mb-2 bg-kb-primary text-white'
                                onClick={() => handleAddItem(item.id)}
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className='grid grid-cols-4 gap-4 items-center'>
                  <Label htmlFor='total_price' className='text-left'>
                    Booking Price
                  </Label>
                  <div className='col-span-3 font-medium items-center'>
                    {calculatedPrice?.toFixed(2)} £
                  </div>
                </div>
                <div className='grid grid-cols-4 gap-4 items-center'>
                  <Label htmlFor='menu_price' className='text-left'>
                    Menu Price
                  </Label>
                  <div className='col-span-3 font-medium items-center'>
                    {menuPrice?.toFixed(2)} £
                  </div>
                </div>
                <div className='grid grid-cols-4 gap-4 items-center'>
                  <Label htmlFor='total_price' className='text-left'>
                    Total Price
                  </Label>
                  <div className='col-span-3 font-medium items-center'>
                    {totalPrice?.toFixed(2)} £
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AddBooking;
