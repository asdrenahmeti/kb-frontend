import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

const ImageCell = ({ imageUrl }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <img
            src={imageUrl}
            alt='Room'
            className='w-8 h-8 object-cover cursor-pointer'
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Room Image</DialogTitle>
          </DialogHeader>
          <img
            src={imageUrl}
            alt='Room'
            className='w-full h-full object-cover'
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageCell;
