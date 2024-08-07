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
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { columns } from './columns';

const Page = () => {
  const [userModal, setUserModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const mutation = useMutation({
    onSuccess: data => {
      console.log('User added successfully:', data); // Log success response
      queryClient.invalidateQueries({ queryKey: ['users'] });
      reset();
      setUserModal(false);
      toast.success('Successfully added a new user', {
        position: 'top-center'
      });
    },
    onError: error => {
      console.error('Error while creating the user:', error); // Log error response
      toast.error('Error while creating the user', {
        position: 'top-center'
      });
    },
    mutationFn: (formData: any) => {
      console.log('Submitting form data:', formData); // Log form data
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/create-account`,
        formData
      );
    }
  });

  const onSubmit = (formData: any) => {
    console.log('THIS IS FORM DATA', formData);
    mutation.mutate(formData);
  };

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/users`)
        .then(res => res.data)
  });

  return (
    <div>
      <h1 className='text-2xl font-medium mb-4'>Manage Users</h1>

      <div className='flex justify-between items-center'>
        <Dialog
          open={userModal}
          onOpenChange={() => {
            setUserModal(!userModal);
            reset();
          }}
        >
          <DialogTrigger asChild>
            <Button className='bg-kb-primary hover:bg-kb-secondary'>
              Add a user
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Add a new user</DialogTitle>
              <DialogDescription>Fill in the user details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='firstName' className='text-right'>
                    First Name
                  </Label>
                  <Input
                    {...register('firstName', { required: true })}
                    id='firstName'
                    placeholder='First Name'
                    className='col-span-3'
                  />
                  {errors.firstName && (
                    <span className='text-red-500 -mt-2 text-xs col-start-2 col-end-4'>
                      First Name is required
                    </span>
                  )}
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='lastName' className='text-right'>
                    Last Name
                  </Label>
                  <Input
                    {...register('lastName', { required: true })}
                    id='lastName'
                    placeholder='Last Name'
                    className='col-span-3'
                  />
                  {errors.lastName && (
                    <span className='text-red-500 -mt-2 text-xs col-start-2 col-end-4'>
                      Last Name is required
                    </span>
                  )}
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='email' className='text-right'>
                    Email
                  </Label>
                  <Input
                    {...register('email', { required: true })}
                    id='email'
                    placeholder='Email'
                    className='col-span-3'
                  />
                  {errors.email && (
                    <span className='text-red-500 -mt-2 text-xs col-start-2 col-end-4'>
                      Email is required
                    </span>
                  )}
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='password' className='text-right'>
                    Password
                  </Label>
                  <Input
                    {...register('password', { required: true })}
                    id='password'
                    placeholder='password'
                    className='col-span-3'
                    type='password'
                  />
                  {errors.password && (
                    <span className='text-red-500 -mt-2 text-xs col-start-2 col-end-4'>
                      Password is required
                    </span>
                  )}
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='role' className='text-right'>
                    Role
                  </Label>
                  <Controller
                    name='role'
                    control={control}
                    defaultValue=''
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='col-span-3'>
                          <SelectValue placeholder='Select a role' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value='CUSTOMER'>Customer</SelectItem>
                            <SelectItem value='SUPERVISOR'>
                              Supervisor
                            </SelectItem>
                            <SelectItem value='MANAGER'>Manager</SelectItem>
                            <SelectItem value='STAFF'>Staff</SelectItem>
                            <SelectItem value='GUEST'>Guest</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <span className='text-red-500 -mt-2 text-xs col-start-2 col-end-4'>
                      Role is required
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
        <DataTable columns={columns} data={users || []} />
      </div>
    </div>
  );
};

export default Page;
