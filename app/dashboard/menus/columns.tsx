import { ColumnDef } from '@tanstack/react-table';

interface Menu {
  id: number;
  name: string;
  item_type: string;
  price: number;
}

export const getColumns = (
  handleEdit: (item: Menu) => void
): ColumnDef<Menu>[] => [
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
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <button
        className='text-blue-500 hover:underline'
        onClick={() => handleEdit(row.original)}
      >
        Edit
      </button>
    )
  }
];
