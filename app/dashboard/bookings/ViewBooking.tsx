import React, { useState, useMemo } from 'react';
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
const { DateTime, Settings } = require('luxon');

type Props = {
  bookingModal: boolean;
  setBookingModal: (value: boolean) => void;
  id: string;
};

const ViewBooking = ({ bookingModal, setBookingModal, id }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const queryClient = useQueryClient();

  const [selectedItems, setSelectedItems] = useState<
    { menu_id: number; quantity: number }[]
  >([]);

  const {
    isPending,
    error,
    data: booking = [],
    isFetching: bookingFetching
  } = useQuery({
    queryKey: ['booking', id],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${id}`)
        .then(res => res.data)
  });

  // const mutation = useMutation({
  //   onSuccess: res => {
  //     reset();
  //     queryClient.invalidateQueries({
  //       queryKey: ['room', booking.roomId]
  //     });
  //     queryClient.invalidateQueries({
  //       queryKey: ['bookings']
  //     });
  //     toast.success(`Successfully arranged a new booking`, {
  //       position: 'top-center'
  //     });

  //     setBookingModal(false);
  //   },
  //   onError: (error: AxiosError) => {
  //     if (error.response) {
  //       console.log(error.response.data);
  //       toast.error(
  //         `${(error?.response?.data as { message?: string })?.message}`,
  //         {
  //           position: 'top-center'
  //         }
  //       );
  //     } else {
  //       console.log('An error occurred:', error.message);
  //     }
  //   },
  //   mutationFn: booking => {
  //     return axios.post('http://localhost:3000/bookings', booking);
  //   }
  // });

  // const onSubmit = async (formData: any) => {
  //   const startTime = formData.startTime;
  //   const [hour, minute] = startTime.split(':');

  //   const formattedStartTime = DateTime.fromObject({
  //     year: booking.date.getFullYear(),
  //     month: booking.date.getMonth() + 1,
  //     day: booking.date.getDate(),
  //     hour: parseInt(hour),
  //     minute: parseInt(minute)
  //   })
  //     .toUTC()
  //     .toISO({ suppressMilliseconds: true });

  //   const endTime = formData.endTime;
  //   const [hourTime, minuteTime] = endTime.split(':');

  //   const formattedEndTime = DateTime.fromObject({
  //     year: booking.date.getFullYear(),
  //     month: booking.date.getMonth() + 1,
  //     day: booking.date.getDate(),
  //     hour: parseInt(hourTime),
  //     minute: parseInt(minuteTime)
  //   })
  //     .toUTC()
  //     .toISO({ suppressMilliseconds: true });

  //   mutation.mutate({
  //     ...formData,
  //     startTime: formattedStartTime,
  //     endTime: formattedEndTime,
  //     roomId: booking.roomId,
  //     date: '2024-05-24T00:00:00.000Z',
  //     menuOrders: selectedItems
  //   });
  // };

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
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>Discover booking details</DialogDescription>
            </DialogHeader>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='booking_id' className='text-left'>
                Booking ID
              </Label>

              <p className='col-span-3 text-sm'>{booking.id}</p>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='booking_id' className='text-left'>
                Start Time
              </Label>

              <p className='col-span-3 text-sm'>
                {DateTime.fromISO(booking?.startTime, { zone: 'utc' })
                  .setZone('local')
                  .toFormat('HH:mm')}
              </p>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='booking_id' className='text-left'>
                End Time
              </Label>

              <p className='col-span-3 text-sm'>
                {DateTime.fromISO(booking?.endTime, { zone: 'utc' })
                  .setZone('local')
                  .toFormat('HH:mm')}
              </p>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='booking_id' className='text-left'>
                Room
              </Label>

              <p className='col-span-3 text-sm'>{booking?.room?.name}</p>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='booking_id' className='text-left'>
                Status
              </Label>

              <p className='col-span-3 text-sm font-medium'>
                {booking?.status}
              </p>
            </div>

            <div className='grid grid-cols-4 gap-4'>
              <Label htmlFor='booking_id' className='text-left'>
                Menu Order
              </Label>

              <div className='col-span-3 items-start'>
                {booking?.menu_orders?.length === 0 ? (
                  <p className='text-sm'>No menu orders</p>
                ) : (
                  booking?.menu_orders?.map((item: any, index: number) => (
                    <div key={index + 'menu'} className='col-span-2 flex gap-4'>
                      <p className='font-medium'>
                        {item.quantity}x {item?.menu?.name}
                      </p>
                      <p>{(item?.menu?.price * item.quantity).toFixed(2)}£</p>
                    </div>
                  ))
                )}
              </div>

              <div className='col-span-3 flex gap-4 mt-4 font-semibold'>
                <p>Total Price:</p>
                <p>
                  {booking?.menu_orders
                    ?.reduce(
                      (total: any, item: any) =>
                        total + item?.menu?.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                  £
                </p>
              </div>

              {/* {booking?.menu_orders[0].id} */}
            </div>
            {/* <form onSubmit={handleSubmit(onSubmit)}>
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
                <div className='grid grid-cols-4 gap-4'>
                  <Label htmlFor='room_id' className='text-left'>
                    Menu
                  </Label>
                  <div className='grid grid-cols-5 col-span-3'>
                    {menu.map((item, index) => {
                      const selectedItem = selectedItems.find(
                        selectedItem => selectedItem.menu_id === item.id
                      );
                      return (
                        <div
                          className='col-span-4 grid grid-cols-5 gap-12'
                          key={index}
                        >
                          <p className='col-span-1'>{item?.name}</p>
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
                    Total Price
                  </Label>
                  <div className='col-span-3 font-medium items-center'>
                    {calculateTotalPrice.toFixed(2)} £
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type='submit' onClick={() => {}}>
                  Save
                </Button>
              </DialogFooter>
            </form> */}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ViewBooking;
