'use client';

import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './../../public/logo.png';
import { useSession } from 'next-auth/react';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Sites', href: '/dashboard/sites', icon: UsersIcon },
  {
    name: 'Rooms',
    href: '/dashboard/rooms',
    icon: FolderIcon
  },
  {
    name: 'Menu',
    href: '/dashboard/menus',
    icon: FolderIcon
  },
  {
    name: 'Booking',
    href: '/dashboard/bookings',
    icon: FolderIcon
  },
  {
    name: 'Users',
    href: '/dashboard/users',
    icon: UsersIcon
  }
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardNavigation() {
  const { data: session, status } = useSession();

  const pathname = usePathname();

  return (
    <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-kb-primary min-w-[200px] px-8 h-screen'>
      <div className='flex h-16 shrink-0 items-center justify-center'>
        <Link href='/'>
          <Image
            src={Logo}
            priority
            alt='Karaokebox Logo'
            className='h-16 ml-auto w-auto object-contain'
          />
        </Link>
      </div>
      <nav className='flex flex-1 flex-col'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <li>
            <ul role='list' className='-mx-2 space-y-1'>
              {navigation.map(item => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link href={item.href} legacyBehavior>
                      <a
                        className={classNames(
                          isActive
                            ? 'bg-white text-kb-primary'
                            : 'text-gray-400 hover:text-white hover:bg-kb-secondary',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className='h-6 w-6 shrink-0'
                          aria-hidden='true'
                        />
                        {item.name}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          <li className='-mx-6 mt-auto'>
            <a
              href='#'
              className='flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800'
            >
              <img
                className='h-8 w-8 rounded-full bg-gray-800'
                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                alt=''
              />
              <span className='sr-only'>Your profile</span>
              <span aria-hidden='true'>Tom Cook</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
