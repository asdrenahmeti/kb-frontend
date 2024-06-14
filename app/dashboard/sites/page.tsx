/* eslint-disable react/no-unescaped-entities */
'use client';
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
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation
} from '@tanstack/react-query';
import axios from 'axios';
import SiteCard from './ui/SiteCard';
import { toast } from 'sonner';

type Props = {};

const Page = (props: Props) => {
  const [siteName, setSiteName] = useState('');
  const [selectedOpening, setSelectedOpening] = useState('');
  const [selectedClosing, setSelectedClosing] = useState('');
  const [siteImage, setSiteImage] = useState<File | null>(null);

  const [siteModal, setSiteModal] = useState(false);
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['sites'],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sites`)
        .then(res => res.data)
  });
  const queryClient = useQueryClient();

  const formatOpeningHour = (inputHour: string) => {
    const hour = parseInt(inputHour, 10);
    if (!isNaN(hour) && hour >= 0 && hour <= 23) {
      const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
      return `${formattedHour}:00`;
    } else {
      return '';
    }
  };

  const mutation = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      setSiteName('');
      setSelectedOpening('');
      setSelectedClosing('');
      setSiteImage(null);
      toast.success(`Site added successfully`, {
        position: 'top-center'
      });
      setSiteModal(false);
    },
    mutationFn: async newSite => {
      const formData = new FormData();
      formData.append('name', siteName);
      formData.append('openingHours', selectedOpening);
      formData.append('closingHours', selectedClosing);
      if (siteImage) {
        formData.append('file', siteImage);
      }

      return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/sites`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
  });

  if (isPending) return 'Loading...';
  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div>
      <h1 className='text-2xl font-medium'>Manage Sites</h1>
      <div className='grid gap-8 w-full grid-cols-1 sm:grid-cols-2 md:w-2/3 lg:w-3/4 mt-4'>
        <Dialog open={siteModal} onOpenChange={() => setSiteModal(!siteModal)}>
          <DialogTrigger asChild>
            <SiteCard
              simple
              site_name=''
              className='cursor-pointer'
              openingHours=''
              closingHours=''
              onClick={() => setSiteModal(true)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='#2A0141'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                className='w-10 h-10 text-kb-primary'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 4.5v15m7.5-7.5h-15'
                />
              </svg>
            </SiteCard>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Add a new site</DialogTitle>
              <DialogDescription>
                Fill a name and upload an image
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Name
                </Label>
                <Input
                  id='name'
                  placeholder='Write a site name'
                  className='col-span-3'
                  value={siteName}
                  onChange={e => setSiteName(e.target.value)}
                />
                <Label htmlFor='openingHour' className='text-right'>
                  Opening hour
                </Label>
                <Input
                  id='name'
                  placeholder='Set opening site hour'
                  className='col-span-3'
                  onChange={e => {
                    const formattedHour = formatOpeningHour(e.target.value);
                    setSelectedOpening(formattedHour);
                  }}
                />
                <Label htmlFor='closingHour' className='text-right'>
                  Closing hour
                </Label>
                <Input
                  id='name'
                  placeholder='Set closing site hours'
                  className='col-span-3'
                  onChange={e => {
                    const formattedHour = formatOpeningHour(e.target.value);
                    setSelectedClosing(formattedHour);
                  }}
                />
                <Label htmlFor='image' className='text-right'>
                  Image
                </Label>
                <Input
                  id='image'
                  type='file'
                  className='col-span-3'
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSiteImage(e.target.files[0]);
                    }
                  }}
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

        {data.map(
          (
            item: {
              image: string;
              id: string;
              name: string;
              openingHours: string;
              closingHours: string;
            },
            index: number
          ) => {
            return (
              <SiteCard
                key={index}
                id={item.id}
                site_name={item.name}
                openingHours={item.openingHours}
                closingHours={item.closingHours}
                simple={false}
                image={item.image}
              ></SiteCard>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Page;
