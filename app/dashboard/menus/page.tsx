'use client';

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
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
import { getColumns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { EditDialog } from './EditDialog';

const Page = () => {
  const [selectedSite, setSelectedSite] = useState('');
  const [menuModal, setMenuModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['menus', selectedSite] });
      setMenuModal(false);
      reset();
    },
    onError: error => {
      console.error('Error creating menu:', error);
    },
    mutationFn: formData => {
      return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/menus`, formData);
    }
  });

  const onSubmit = async (formData: any) => {
    mutation.mutate({
      ...formData,
      price: Number(formData.price),
      item_type: formData.item_type,
      site_id: selectedSite
    });
  };

  const { data: sites = [] } = useQuery({
    queryKey: ['sites'],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sites`)
        .then(res => res.data)
  });

  const {
    isPending,
    error,
    data = [],
    isFetching
  } = useQuery({
    queryKey: ['menus', selectedSite],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/menus/site/${selectedSite}`)
        .then(res => res.data),
    enabled: !!selectedSite // Only run the query if selectedSite is not empty
  });

  const itemType = watch('item_type');

  const handleEdit = (item: any) => {
    setEditItem(item);
  };

  const handleCloseEditDialog = () => {
    setEditItem(null);
  };

  return (
    <div>
      <h1 className='text-2xl font-medium mb-4'>Manage Menus</h1>

      <div className='flex justify-between items-center'>
        <Select onValueChange={item => setSelectedSite(item)}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select a site' />
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
        <Dialog open={menuModal} onOpenChange={() => setMenuModal(!menuModal)}>
          <DialogTrigger asChild>
            <Button
              className='bg-kb-primary hover:bg-kb-secondary'
              disabled={selectedSite == ''}
            >
              Add item menus{' '}
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
              <DialogTitle>Add a new menu item</DialogTitle>
              <DialogDescription>Fill the details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='name' className='text-right'>
                    Name
                  </Label>
                  <Input
                    {...register('name', { required: true })}
                    id='name'
                    placeholder='Write a menu item name'
                    className='col-span-3'
                  />
                  {errors.name && (
                    <span className='text-red-500 -mt-2 text-xs col-start-2 col-end-4'>
                      Name is required
                    </span>
                  )}
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='price' className='text-right'>
                    Price
                  </Label>
                  <Input
                    {...register('price', { required: true })}
                    id='price'
                    placeholder='Price per unit'
                    className='col-span-3'
                    type='decimal'
                  />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='type' className='text-right'>
                    Type
                  </Label>
                  <Select
                    value={itemType}
                    onValueChange={value => setValue('item_type', value)}
                  >
                    <SelectTrigger className='w-full col-span-3'>
                      <SelectValue placeholder='Select a menu item type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='FOOD'>Food</SelectItem>
                        <SelectItem value='DRINK'>Drink</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.item_type && (
                    <span className='text-red-500 -mt-2 text-xs col-start-2 col-end-4'>
                      Type is required
                    </span>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type='submit'>Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='mt-8'>
        <DataTable columns={getColumns(handleEdit)} data={data || []} />
      </div>
      {editItem && (
        <EditDialog
          item={editItem}
          onClose={handleCloseEditDialog}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ['menus', selectedSite]
            });
            handleCloseEditDialog();
          }}
        />
      )}
    </div>
  );
};

export default Page;
