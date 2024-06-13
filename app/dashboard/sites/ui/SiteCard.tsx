import clsx from 'clsx';
import React, { use, useEffect, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation
} from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  site_name: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  id?: string;
  simple: boolean;
  openingHours: any;
  closingHours: any;
};

const SiteCard = ({
  site_name,
  id,
  children,
  onClick,
  className,
  simple,
  openingHours,
  closingHours
}: Props) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [siteName, setSiteName] = useState(site_name);

  const queryClient = useQueryClient();

  const deletion = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      setSiteName(site_name);
      setOpen(false);
    },
    mutationFn: item => {
      return axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/sites/${item}`);
    }
  });

  useEffect(() => {
    setSiteName(site_name);
  }, [site_name]);

  const mutation = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      setSiteName('');
      setEditMode(false);
    },
    mutationFn: editedSite => {
      return axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/sites/${id}`, {
        editedSite,
        id: id,
        site_name: siteName
      });
    }
  });

  return (
    <div
      className={clsx(
        'p-8 h-32 lg:h-56 shadow-lg relative w-full border  flex justify-center items-center rounded-2xl overflow-hidden',
        className
      )}
      onClick={onClick}
    >
      {!simple && (
        <div className=' h-8 flex justify-center items-center top-0 gap-1 pr-2 right-0 rounded-tr-2xl absolute '>
          <Dialog open={editMode} onOpenChange={() => setEditMode(!editMode)}>
            <DialogTrigger asChild>
              <div className='cursor-pointer'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6 '
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                  />
                </svg>
              </div>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Edit site</DialogTitle>
                <DialogDescription>
                  Edit name and change the image
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='name' className='text-right'>
                    Name
                  </Label>
                  <Input
                    id='name'
                    className='col-span-3'
                    value={siteName}
                    onChange={e => setSiteName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type='submit'
                  onClick={() => {
                    if (siteName === '') {
                      return;
                    }
                    mutation.mutate();
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogTrigger asChild>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6 text-red-600 cursor-pointer'
                onClick={() => {}}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                />
              </svg>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant='destructive' onClick={() => deletion.mutate()}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className='flex flex-col justify-center items-center'>
        <p className='text-xl'>{site_name}</p>
        {openingHours && closingHours && (
          <p>
            {openingHours} - {closingHours}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

export default SiteCard;
