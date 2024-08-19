import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userData: any;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  isOpen,
  onClose,
  userId,
  userData
}) => {
  const queryClient = useQueryClient();
  const {
    control,
    register,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: userData
  });

  useEffect(() => {
    if (userData) {
      reset(userData);
    }
  }, [userData, reset]);

  const onSubmit = async (data: any) => {
    // Filter out unwanted properties
    const { id, phone_number, token, createdAt, updatedAt, ...filteredData } = data;

    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}`, filteredData);
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>Update the user details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='firstName' className='text-right'>
                First Name
              </Label>
              <Input
                {...register('firstName')}
                id='firstName'
                placeholder='First Name'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='lastName' className='text-right'>
                Last Name
              </Label>
              <Input
                {...register('lastName')}
                id='lastName'
                placeholder='Last Name'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>
                Email
              </Label>
              <Input
                {...register('email')}
                id='email'
                placeholder='Email'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='username' className='text-right'>
                Username
              </Label>
              <Input
                {...register('username')}
                id='username'
                placeholder='Username'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='role' className='text-right'>
                Role
              </Label>
              <Controller
                name='role'
                control={control}
                defaultValue=''
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
                        <SelectItem value='SUPERVISOR'>Supervisor</SelectItem>
                        <SelectItem value='MANAGER'>Manager</SelectItem>
                        <SelectItem value='STAFF'>Staff</SelectItem>
                        <SelectItem value='GUEST'>Guest</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserModal;