"use client"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { DataTable } from "./data-table"
import { getColumns } from "./columns"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Duration } from "luxon"

interface Song {
  id: string
  artistName: string
  songName: string
  duration?: number
}

interface SongFormData extends Omit<Song, 'duration'> {
  durationMinutes: number
  durationSeconds: number
}

const Page = () => {
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)

  const queryClient = useQueryClient()

  const form = useForm<SongFormData>({
    defaultValues: {
      artistName: "",
      songName: "",
      durationMinutes: 0,
      durationSeconds: 0,
    },
  })

  const { data: songs = [] } = useQuery<Song[]>({
    queryKey: ["songs"],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/songs`)
        .then((res) => res.data),
  })

  const editMutation = useMutation({
    mutationFn: (updatedSong: Partial<Song>) =>
      axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/songs/${updatedSong.id}`,
        {
          artistName: updatedSong.artistName,
          songName: updatedSong.songName,
          duration: updatedSong.duration,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["songs"],
      })
      setEditModal(false)
      toast.success("Song updated successfully", {
        position: "top-center",
      })
    },
    onError: (error) => {
      toast.error("Failed to update song", {
        position: "top-center",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/songs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["songs"],
      })
      setDeleteModal(false)
      toast.success("Song deleted successfully", {
        position: "top-center",
      })
    },
    onError: (error) => {
      toast.error("Failed to delete song", {
        position: "top-center",
      })
    },
  })

  function handleEdit(song: Song): void {
    setSelectedSong(song)
    const minutes = Math.floor((song.duration || 0) / 60)
    const seconds = (song.duration || 0) % 60
    form.reset({
      ...song,
      durationMinutes: minutes,
      durationSeconds: seconds,
    })
    setEditModal(true)
  }

  function handleDelete(song: Song): void {
    setSelectedSong(song)
    setDeleteModal(true)
  }

  function onSubmit(data: SongFormData) {
    const duration = Duration.fromObject({
      minutes: data.durationMinutes,
      seconds: data.durationSeconds,
    }).as('seconds')

    editMutation.mutate({
      ...data,
      id: selectedSong!.id,
      duration: Math.round(duration),
    })
  }

  const columns = getColumns(handleEdit, handleDelete)

  return (
    <div className="">
      <h1 className="text-2xl font-medium mb-6">Manage songs</h1>
      <DataTable songs={songs} columns={columns} />

      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Song</DialogTitle>
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
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Song</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this song? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedSong && deleteMutation.mutate(selectedSong.id)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page