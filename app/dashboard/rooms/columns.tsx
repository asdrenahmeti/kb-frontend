'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Rooms = {
  id: string;
  capacity: number;
  closing_hour: number;
  opening_hour: number;
  name: string;
  pricing: string;
  slots: {
    startTime: string;
    endTime: string;
    pricing: string;
  }[];
  slot_1: {
    startTime: string;
    endTime: string;
  };
};

export const columns: ColumnDef<Rooms>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity'
  },
  {
    accessorKey: `slot_1`,
    header: 'Slot 1'
  },
  {
    accessorKey: 'slot_2',
    header: 'Slot 2'
  }
  // {
  //   accessorKey: 'closing_hour',
  //   header: 'Closing Hour'
  // },
  // {
  //   accessorKey: 'opening_hour',
  //   header: 'Opening Hour'
  // },
];
