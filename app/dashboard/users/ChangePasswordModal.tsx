import React from 'react';
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
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<{ new_password: string }>();

  const onSubmit = async (data: { new_password: string }) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/change-password`,
        data
      );
      toast.success('Password changed successfully');
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter a new password for the user
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='new_password' className='text-right'>
                New Password
              </Label>
              <Input
                {...register('new_password', { required: true })}
                id='new_password'
                placeholder='New Password'
                className='col-span-3'
                type='password'
              />
              {errors.new_password && (
                <span className='text-red-500 -mt-2 text-xs col-start-2 col-end-4'>
                  Password is required
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
  );
};

export default ChangePasswordModal;
