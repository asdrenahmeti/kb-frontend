'use client';

import AnimatedSlider from '@/components/ui/animated-slider';
import BookingForm from '@/components/ui/booking-form';
import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';
import NavBar from '@/components/ui/navigation';
import Test from '@/components/ui/room-bokz';
import { toast } from 'sonner';

export default function Home() {
  return (
    <div className='bg-black'>
      {/* <NavBar /> */}
      <AnimatedSlider />
      <BookingForm />
      <Footer />
    </div>
  );
}
