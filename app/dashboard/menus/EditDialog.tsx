'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface EditDialogProps {
  item: Menu;
  onClose: () => void;
  onSuccess: () => void;
}

interface Menu {
  id: number;
  name: string;
  item_type: string;
  price: number;
  site?: {
    id: number;
  };
}

export const EditDialog: React.FC<EditDialogProps> = ({
  item,
  onClose,
  onSuccess
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: item.name,
      price: item.price,
      item_type: item.item_type
    }
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['menus', item.site?.id] });
      onSuccess();
      toast.success(`Item edited successfully`, {
        position: 'top-center'
      });
    },
    onError: error => {
      console.error('Error updating menu:', error);
    },
    mutationFn: formData => {
      return axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/menus/${item.id}`,
        formData
      );
    }
  });

  const onSubmit = async (formData: any) => {
    mutation.mutate({
      ...formData,
      price: Number(formData.price)
    });
  };

  // Watch for item_type changes and update the form value
  const itemType = watch('item_type');
  React.useEffect(() => {
    setValue('item_type', item.item_type);
  }, [item.item_type, setValue]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>Update the details</DialogDescription>
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
  );
};
