'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Menu = {
  id: string;
  item_type: 'DRINK' | 'FOOD';
  name: string;
  price: number;
  site?: any;
};

export const columns: ColumnDef<Menu>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'item_type',
    header: 'Item Type'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  }
];
