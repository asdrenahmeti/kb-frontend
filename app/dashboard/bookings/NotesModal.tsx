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
            <div key={index} className="flex flex-col bg-gray-100 p-2 rounded">
              {note.content}
              <div className="flex justify-between">
                <p className="text-xs">
                  {note?.user?.firstName + " " + note?.user?.lastName}
                </p>
                <p className="text-xs">
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
