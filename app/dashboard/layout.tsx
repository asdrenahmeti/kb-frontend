// app/dashboard/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import DashboardNavigation from '@/components/ui/dashboard-navigation';
import MobileDashboardNavigation from '@/components/ui/mobile-dashboard-navigation';
import ClientSessionProvider from '@/components/session-provider';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Karaokebox Booking System',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children,
  session
}: {
  children: ReactNode;
  session: any;
}) {
  return (
    <html lang='en'>
      <head />
      <body className='flex flex-col md:flex-row'>
        <ClientSessionProvider session={session}>
          <div className='hidden md:block md:max-w-[400px]'>
            <DashboardNavigation />
          </div>
          <div className='md:hidden'>
            <MobileDashboardNavigation />
          </div>
          <main className='px-8 pt-8 w-full h-screen overflow-y-scroll'>
            {children}
          </main>
          <Toaster />
        </ClientSessionProvider>
      </body>
    </html>
  );
}
