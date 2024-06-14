import ImageCell from './ImageCell';
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
  image: string;
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
    accessorKey: 'slot_1',
    header: 'Slot 1'
  },
  {
    accessorKey: 'slot_2',
    header: 'Slot 2'
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/public/room-images/${row.original.image}`;
      return <ImageCell imageUrl={imageUrl} />;
    }
  }
];
