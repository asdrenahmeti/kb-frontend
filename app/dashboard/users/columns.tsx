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
  handleChangePassword: (id: string) => void,
  handleEditUser: (user: User) => void,
  handleDeleteUser: (id: string) => void
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
      <div className='flex space-x-2'>
        <Button
          onClick={() => handleChangePassword(row.original.id)}
          className='bg-kb-primary hover:bg-kb-secondary'
        >
          Change Password
        </Button>
        <Button
          onClick={() => handleEditUser(row.original)}
          className='bg-kb-primary hover:bg-kb-secondary'
        >
          Edit
        </Button>
        <Button
          onClick={() => handleDeleteUser(row.original.id)}
          className='bg-red-500 hover:bg-red-700'
        >
          Delete
        </Button>
      </div>
    )
  }
];