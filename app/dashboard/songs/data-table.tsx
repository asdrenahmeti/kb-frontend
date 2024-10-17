'use client'

import React, { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { Duration } from "luxon"

interface Song {
  id: string
  artistName: string
  songName: string
  duration?: number // Duration in seconds, optional field
}

interface DataTableProps {
  songs: Song[]
  columns: ColumnDef<Song>[]
}

interface SongFormData {
  artistName: string
  songName: string
  durationMinutes: number
  durationSeconds: number
}

export function DataTable({ songs, columns }: DataTableProps) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [pageSize, setPageSize] = useState(10) // Default page size
  const [addSongModal, setAddSongModal] = useState(false)

  const queryClient = useQueryClient()

  const form = useForm<SongFormData>({
    defaultValues: {
      artistName: "",
      songName: "",
      durationMinutes: 0,
      durationSeconds: 0,
    },
  })

  const table = useReactTable({
    data: songs,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  })

  const addSongMutation = useMutation({
    mutationFn: (newSong: Omit<Song, 'id'>) =>
      axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/songs`, newSong),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["songs"],
      })
      setAddSongModal(false)
      form.reset()
      toast.success("Song added successfully", {
        position: "top-center",
      })
    },
    onError: (error) => {
      toast.error("Failed to add song", {
        position: "top-center",
      })
    },
  })

  function onSubmit(data: SongFormData) {
    const duration = Duration.fromObject({
      minutes: data.durationMinutes,
      seconds: data.durationSeconds,
    }).as('seconds')

    addSongMutation.mutate({
      artistName: data.artistName,
      songName: data.songName,
      duration: Math.round(duration),
    })
  }

  return (
    <div className="space-y-4">
      {/* Search bar and Add Song button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 w-[300px]">
         
          <Input
            type="text"
            placeholder="Search songs..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full"
          />
        </div>
        <Button className='bg-kb-primary hover:bg-kb-secondary' onClick={() => setAddSongModal(true)}>
        Add a song{' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='#FFFFFF'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                className='ml-2 w-6 h-6 text-white cursor-pointer'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 4.5v15m7.5-7.5h-15'
                />
              </svg>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              const size = Number(value)
              setPageSize(size)
              table.setPageSize(size)
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Go to previous page</span>
          </Button>
          <p className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Go to next page</span>
          </Button>
        </div>
      </div>

      {/* Add Song Modal */}
      <Dialog open={addSongModal} onOpenChange={setAddSongModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Song</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="songName"
                rules={{ required: "Song name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Song Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="artistName"
                rules={{ required: "Artist name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="durationMinutes"
                  rules={{
                    required: "Minutes are required",
                    min: { value: 0, message: "Minutes cannot be negative" },
                    max: { value: 119, message: "Duration must not exceed 2 hours" },
                  }}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minutes</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" max="119" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationSeconds"
                  rules={{
                    required: "Seconds are required",
                    min: { value: 0, message: "Seconds cannot be negative" },
                    max: { value: 59, message: "Seconds must be less than 60" },
                  }}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Seconds</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" max="59" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Add Song</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}