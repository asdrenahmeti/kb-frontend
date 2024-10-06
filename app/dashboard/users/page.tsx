'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { DataTable } from './data-table';
import { getColumns } from './columns';
import { toast } from 'sonner';
import ChangePasswordModal from './ChangePasswordModal';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import UpdateUserModal from './UpdateUserModal';
import DeleteUserModal from './DeleteUserModal';

const Page = () => {
  const [userModal, setUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [changePasswordModal, setChangePasswordModal] = useState({
    isOpen: false,
    userId: ''
  });
  const [updateUserModal, setUpdateUserModal] = useState({
    isOpen: false,
    user: null
  });
  const [deleteUserModal, setDeleteUserModal] = useState({
    isOpen: false,
    userId: ''
  });
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
      queryClient.invalidateQueries({ queryKey: ['users'] });
      reset();
      setUserModal(false);
      toast.success('Successfully added a new user', {
        position: 'top-center'
      });
    },
    onError: error => {
      console.error('Error while creating the user:', error);
      toast.error('Error while creating the user', {
        position: 'top-center'
      });
    },
    mutationFn: (formData: any) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/create-account`,
        formData
      );
    }
  });

  const onSubmit = (formData: any) => {
    mutation.mutate(formData);
  };

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/users`)
        .then(res => res.data)
  });

  const handleChangePassword = (userId: string) => {
    setChangePasswordModal({ isOpen: true, userId });
  };

  const handleEditUser = (user: any) => {
    setUpdateUserModal({ isOpen: true, user });
  };

  const handleDeleteUser = (userId: string) => {
    setDeleteUserModal({ isOpen: true, userId });
  };

  const columns = getColumns(handleChangePassword, handleEditUser, handleDeleteUser);

  return (
    <div>
      <h1 className='text-2xl font-medium mb-4'>Manage Users</h1>

      <div className='flex justify-between items-center mb-4'>
        <Input
          type='text'
          placeholder='Search users...'
          onChange={e => setSearchTerm(e.target.value)}
          className='w-1/3'
        />
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
                {/* Form fields */}
              </div>
              <DialogFooter>
                <Button type='submit'>Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='mt-8'>
        <DataTable
          columns={columns}
          data={users || []}
          globalFilter={searchTerm}
        />
      </div>

      <ChangePasswordModal
        isOpen={changePasswordModal.isOpen}
        onClose={() => setChangePasswordModal({ isOpen: false, userId: '' })}
        userId={changePasswordModal.userId}
      />

      <UpdateUserModal
        isOpen={updateUserModal.isOpen}
        onClose={() => setUpdateUserModal({ isOpen: false, user: null })}
        userId={updateUserModal.user?.id}
        userData={updateUserModal.user}
      />

      <DeleteUserModal
        isOpen={deleteUserModal.isOpen}
        onClose={() => setDeleteUserModal({ isOpen: false, userId: '' })}
        userId={deleteUserModal.userId}
      />
    </div>
  );
};

export default Page;