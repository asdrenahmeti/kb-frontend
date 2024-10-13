import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";

interface NotesModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  bookingId: string;
}

const NotesModal: React.FC<NotesModalProps> = ({
  showModal,
  setShowModal,
  bookingId,
}) => {
  const [newNote, setNewNote] = useState("");
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();

  const { data: notes, refetch: refetchNotes } = useQuery({
    queryKey: ["notes", bookingId],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/notes/booking/${bookingId}`)
        .then((res) => res.data),
    enabled: false, // This prevents the query from running automatically
  });

  useEffect(() => {
    if (showModal) {
      refetchNotes();
    }
  }, [showModal, refetchNotes]);

  const addNoteMutation = useMutation({
    mutationFn: (note: string) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/notes/${bookingId}`,
        { bookingId: bookingId, content: note, userId: session?.user?.id }
      );
    },
    onSuccess: () => {
      setNewNote("");
      toast.success("Note added successfully");
      refetchNotes(); // Refetch notes after adding a new one
    },
    onError: (error) => {
      toast.error("Failed to add note");
    },
  });

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNoteMutation.mutate(newNote);
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notes for Booking</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {notes?.map((note: any, index: number) => (
            <div
              key={index}
              className={`flex flex-col p-2 rounded mb-2 ${
                note.content === "CREATED" || note.content === "UPDATED"
                  ? "bg-kb-primary/70 text-white"
                  : "bg-gray-300"
              }`}
            >
              <div className="mb-1">
                <p
                  className={`text-sm ${
                    note.content === "CREATED" || note.content === "UPDATED"
                      ? "font-bold"
                      : ""
                  }`}
                >
                  {note.content}
                </p>
              </div>

              {note.metadata && (
                <>
                  <ul className="text-sm">
                    {note.metadata.date && (
                      <li>
                        <b>Date:</b>{" "}
                        <span className="inline-block px-1 bg-red-600 text-white rounded-md font-bold">
                          {DateTime.fromISO(note.metadata.date.old).toFormat(
                            "yyyy-MM-dd"
                          )}
                        </span>{" "}
                        <b>to</b>{" "}
                        <span className="inline-block px-1 bg-green-600 text-white rounded-md font-bold">
                          {DateTime.fromISO(note.metadata.date.new).toFormat(
                            "yyyy-MM-dd"
                          )}{" "}
                        </span>
                      </li>
                    )}
                    {note.metadata.roomId && (
                      <li>
                        <b>Room:</b>{" "}
                        <span className="inline-block px-1 bg-red-600 text-white rounded-md font-bold">
                          {note.metadata.roomId.old.name}
                        </span>{" "}
                        to{" "}
                        <span className="inline-block px-1 bg-green-600 text-white rounded-md font-bold">
                          {note.metadata.roomId.new.name}{" "}
                        </span>
                      </li>
                    )}
                    {note.metadata.startTime && (
                      <li>
                        <b>Start time:</b>{" "}
                        <span className="inline-block px-1 bg-red-600 text-white rounded-md font-bold">
                          {DateTime.fromISO(note.metadata.startTime.old)
                            .setZone("UTC") // Set timezone to UTC
                            .toFormat("HH:mm")}
                        </span>{" "}
                        to{" "}
                        <span className="inline-block px-1 bg-green-600 text-white rounded-md font-bold">
                          {DateTime.fromISO(note.metadata.startTime.new)
                            .setZone("UTC") // Set timezone to UTC
                            .toFormat("HH:mm")}
                        </span>
                      </li>
                    )}
                    {note.metadata.endTime && (
                      <li className="mt-1">
                        <b>End time:</b>{" "}
                        <span className="inline-block px-1 bg-red-600 text-white rounded-md font-bold">
                          {DateTime.fromISO(note.metadata.endTime.old)
                            .setZone("UTC") // Set timezone to UTC
                            .toFormat("HH:mm")}
                        </span>{" "}
                        to{" "}
                        <span className="inline-block px-1 bg-green-600 text-white rounded-md font-bold">
                          {DateTime.fromISO(note.metadata.endTime.new)
                            .setZone("UTC") // Set timezone to UTC
                            .toFormat("HH:mm")}
                        </span>
                      </li>
                    )}
                  </ul>
                </>
              )}

              <div className="flex justify-between text-xs mt-3">
                <p>
                  {note?.user?.firstName + " " + (note?.user?.lastName ?? "")}
                </p>
                <p>
                  {DateTime.fromISO(note.updatedAt)
                    .toLocal()
                    .toFormat("yyyy-MM-dd HH:mm")}
                </p>
              </div>
            </div>
          ))}

          <div className="flex space-x-2">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
            />
            <Button onClick={handleAddNote}>Add Note</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotesModal;
