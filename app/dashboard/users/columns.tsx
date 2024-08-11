import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export const getColumns = (
  handleChangePassword: (id: string) => void
): ColumnDef<User>[] => [
  {
    accessorKey: 'firstName',
    header: 'First Name'
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'role',
    header: 'Role'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        onClick={() =>
          handleChangePassword && handleChangePassword(row.original.id)
        }
        className='bg-kb-primary hover:bg-kb-secondary'
      >
        Change Password
      </Button>
    )
  }
];
