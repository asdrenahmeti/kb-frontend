'use client';

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation
} from '@tanstack/react-query';
import axios from 'axios';
import { Rooms, columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form'; // Import useForm

type Props = {};

const Page = (props: Props) => {
  const [selectedSite, setSelectedSite] = useState('');
  const [addRoomSite, setAddRoomSite] = useState('');
  const [roomModal, setRoomModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const queryClient = useQueryClient();

  const formatOpeningHour = (inputHour: string) => {
    // Parse the input hour as integer
    const hour = parseInt(inputHour, 10);

    // Check if hour is a valid number
    if (!isNaN(hour) && hour >= 0 && hour <= 23) {
      // Convert hour to string with leading zero if needed
      const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
      // Return the formatted opening hour string
      return `${formattedHour}:00`;
    } else {
      // Return empty string if input is invalid
      return '';
    }
  };

  const mutation = useMutation({
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['sites', 'rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });

      setRoomModal(false);
      // You can add any additional logic here, such as displaying a success message or redirecting the user
    },
    onError: error => {
      console.error('Error creating room:', error);
      // You can handle errors here, such as displaying an error message to the user
    },
    mutationFn: formData => {
      return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/rooms`, formData);
    }
  });

  const onSubmit = async (formData: any) => {
    mutation.mutate({
      ...formData,
      closing_hour: undefined,
      opening_hour_1: undefined,
      opening_hour_2: undefined,
      closing_hour_1: undefined,
      closing_hour_2: undefined,
      pricing_1: undefined,
      pricing_2: undefined,
      openingHours: [
        {
          startTime: formatOpeningHour(formData.opening_hour_1),
          endTime: formatOpeningHour(formData.closing_hour_1),
          pricing: Number(formData.pricing_1)
        },
        formData.opening_hour_2
          ? {
              startTime: formatOpeningHour(formData.opening_hour_2),
              endTime: formatOpeningHour(formData.closing_hour_2),
              pricing: Number(formData.pricing_2)
            }
          : null
      ].filter(Boolean),
      capacity: Number(formData.capacity),
      siteId: addRoomSite,
      available: true
    });
  };

  const {
    isPending,
    error,
    data = [],
    isFetching
  } = useQuery({
    queryKey: ['sites'],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sites`)
        .then(res => res.data)
  });

  const {
    isPending: isPendingRoom,
    error: errorRooms,
    data: dataRoom = [],
    isFetching: isFetchingRoom
  } = useQuery({
    queryKey: ['rooms', selectedSite],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sites/${selectedSite}/rooms`)
        .then(res => res.data),
    refetchOnWindowFocus: true,
    enabled: !!selectedSite
  });

  const filtered = dataRoom?.rooms?.map((item: any) => {
    return {
      name: item.name,
      capacity: item.capacity,
      slot_1: `${item.slots[0].startTime} - ${item.slots[0].endTime} | ${item.slots[0].pricing}£`,
      slot_2: item.slots[1]
        ? `${item.slots[1].startTime} - ${item.slots[1].endTime} | ${item.slots[1].pricing}£`
        : 'not defined'
    };
  });

  return (
    <div>
      <h1 className='text-2xl font-medium mb-4'>Manage Rooms</h1>

      <div className='flex justify-between items-center'>
        <Select onValueChange={item => setSelectedSite(item)}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select a site' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {data.map((item: any, index: number) => (
                <SelectItem value={item.id} key={index}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Dialog open={roomModal} onOpenChange={() => setRoomModal(!roomModal)}>
          <DialogTrigger asChild>
            <Button className='bg-kb-primary hover:bg-kb-secondary'>
              Add a room{' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='#FFFFFF'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                className='ml-2 w-6 h-6 text-white cursor-pointer'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 4.5v15m7.5-7.5h-15'
                />
              </svg>
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Add a new room</DialogTitle>
              <DialogDescription>
                Fill a name and upload an image
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='Capacity' className='text-right'>
                    Site
                  </Label>
                  <Select
                    {...register('site')}
                    onValueChange={item => setAddRoomSite(item)}
                  >
                    <SelectTrigger className='w-full col-span-3 '>
                      <SelectValue placeholder='Select a site' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {data.map((item: any, index: number) => (
                          <SelectItem value={item.id} key={index}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.site && (
                    <span className='text-red-500 -mt-2 text-xs col-start-2 col-end-4'>
                      Site is required
                    </span>
                  )}
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='name' className='text-right'>
                    Name
                  </Label>
                  <Input
                    {...register('name', { required: true })}
                    id='name'
                    placeholder='Write a room name'
                    className='col-span-3'
                  />
                  {errors.name && (
                    <span className='text-red-500 -mt-2 text-xs col-start-2 col-end-4'>
                      Name is required
                    </span>
                  )}
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='opening_hour_1' className='text-right'>
                    Pricing 1
                  </Label>
                  <div className='flex flex-col col-span-3 gap-2'>
                    <div className='w-full flex gap-2'>
                      <Input
                        {...register('opening_hour_1', { required: true })}
                        id='opening_hour_1'
                        placeholder='From'
                        className='col-span-3 '
                        type='number'
                      />
                      <Input
                        {...register('closing_hour_1', { required: true })}
                        id='closing_hour_1'
                        placeholder='To'
                        className='col-span-3'
                        type='number'
                      />
                    </div>

                    <Input
                      {...register('pricing_1', { required: true })}
                      id='pricing_1'
                      placeholder='Pricing'
                      className='col-span-3'
                      type='number'
                    />
                  </div>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='opening_hour_2' className='text-right'>
                    Pricing 2
                  </Label>
                  <div className='flex flex-col col-span-3 gap-2'>
                    <div className='w-full flex gap-2'>
                      <Input
                        {...register('opening_hour_2', { required: false })}
                        id='opening_hour_2'
                        placeholder='From'
                        className='col-span-3 '
                        type='number'
                      />
                      <Input
                        {...register('closing_hour_2', { required: false })}
                        id='closing_hour'
                        placeholder='To'
                        className='col-span-2'
                        type='number'
                      />
                    </div>

                    <Input
                      {...register('pricing_2', { required: false })}
                      id='pricing_2'
                      placeholder='Pricing'
                      className='col-span-3'
                      type='number'
                    />
                  </div>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='Capacity' className='text-right'>
                    Capacity
                  </Label>
                  <Input
                    {...register('capacity', { required: true })}
                    id='capacity'
                    placeholder='Room capacity'
                    className='col-span-3'
                    type='number'
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type='submit'>Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {selectedSite !== '' && (
        <div className='mt-8'>
          <DataTable columns={columns} data={filtered || []} />
        </div>
      )}
    </div>
  );
};

export default Page;
