import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import RoomForm from './RoomForm';

const EditRoomModal = ({ isOpen, setIsOpen, onSubmit, room, sites }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Edit Room</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
        </DialogHeader>
        <RoomForm
          onSubmit={onSubmit}
          room={room}
          sites={sites}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditRoomModal;
