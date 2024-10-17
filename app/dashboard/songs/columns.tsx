import { ColumnDef } from '@tanstack/react-table';
import { DateTime } from 'luxon';

interface Song {
  id: string;
  artistName: string;
  songName: string;
  duration?: number; // Duration in seconds, optional field
}

export const getColumns = (
  handleEdit: (item: Song) => void,
  handleDelete: (item: Song) => void
): ColumnDef<Song>[] => [
  {
    accessorKey: 'artistName',
    header: 'Artist Name',
  },
  {
    accessorKey: 'songName',
    header: 'Song Name',
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => {
      const durationInSeconds = row.original.duration;
      if (durationInSeconds === undefined) {
        return 'N/A';
      }

      const duration = DateTime.fromSeconds(durationInSeconds).toFormat('m:ss');
      return duration;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <button
          className="text-blue-500 hover:underline"
          onClick={() => handleEdit(row.original)}
        >
          Edit
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(row.original)}
        >
          Delete
        </button>
      </div>
    ),
  },
];
