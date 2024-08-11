'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface DeleteBookingModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setActiveBooking: (booking: any) => void;
  bookingId: string;
}

const DeleteBookingModal: React.FC<DeleteBookingModalProps> = ({
  showModal,
  setShowModal,
  setActiveBooking,
  bookingId
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking deleted successfully');
      setActiveBooking(null);
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
    mutationFn: (id: string) => {
      return axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${id}`);
    }
  });

  const handleDelete = () => {
    mutation.mutate(bookingId);
    setShowModal(false);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this booking?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleDelete} variant='destructive'>
            Delete
          </Button>
          <Button onClick={() => setShowModal(false)} variant='secondary'>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBookingModal;
