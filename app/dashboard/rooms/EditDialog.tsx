import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Rooms } from "./columns";
import { DateTime } from "luxon";

interface EditDialogProps {
  room: Rooms;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditDialog: React.FC<EditDialogProps> = ({
  room,
  onClose,
  onSuccess,
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: room.name,
      capacity: room.capacity,
      opening_hour_1: room.slots[0]?.startTime,
      closing_hour_1: room.slots[0]?.endTime,
      pricing_1: room.slots[0]?.pricing,
      opening_hour_2: room.slots[1]?.startTime || "",
      closing_hour_2: room.slots[1]?.endTime || "",
      pricing_2: room.slots[1]?.pricing || "",
    },
  });

  const queryClient = useQueryClient();
  const [fromOptions, setFromOptions] = useState<string[]>([]);
  const [toOptions, setToOptions] = useState<string[]>([]);
  const [selectedFrom, setSelectedFrom] = useState(
    room.slots[0]?.startTime || ""
  );
  const [selectedTo, setSelectedTo] = useState(room.slots[0]?.endTime || "");
  const [fromOptions2, setFromOptions2] = useState<string[]>([]);
  const [toOptions2, setToOptions2] = useState<string[]>([]);
  const [selectedFrom2, setSelectedFrom2] = useState(
    room.slots[1]?.startTime || ""
  );
  const [selectedTo2, setSelectedTo2] = useState(room.slots[1]?.endTime || "");

  const generateHourOptions = () => {
    let hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(DateTime.fromObject({ hour: i }).toFormat("HH:mm"));
    }
    return hours;
  };

  useEffect(() => {
    const hours = generateHourOptions();
    setFromOptions(hours);
    setToOptions(hours);
    setFromOptions2(hours);
    setToOptions2(hours);
  }, []);

  const mutation = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      reset();
      onClose();
      onSuccess();
      toast.success(`Successfully edited the room`, {
        position: "top-center",
      });
    },
    onError: () => {
      toast.error(`Error while editing the room`, {
        position: "top-center",
      });
    },
    mutationFn: (formData: any) => {
      return axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/rooms/${room.id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const onSubmit = async (formData: any) => {

    const openingHours = [
      {
        startTime: formData.opening_hour_1,
        endTime: formData.closing_hour_1,
        pricing: Number(formData.pricing_1),
      },
      formData.opening_hour_2
        ? {
            startTime: formData.opening_hour_2,
            endTime: formData.closing_hour_2,
            pricing: Number(formData.pricing_2),
          }
        : null,
    ].filter(Boolean);

    mutation.mutate({
      name: formData.name,
      openingHours,
      capacity: Number(formData.capacity),
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription>Update the room details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                {...register("name", { required: true })}
                id="name"
                placeholder="Room name"
                className="col-span-3"
              />
              {errors.name && (
                <span className="text-red-500 -mt-2 text-xs col-start-2 col-end-4">
                  Name is required
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Input
                {...register("capacity", { required: true })}
                id="capacity"
                placeholder="Room capacity"
                className="col-span-3"
                type="number"
              />
              {errors.capacity && (
                <span className="text-red-500 -mt-2 text-xs col-start-2 col-end-4">
                  Capacity is required
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="opening_hour_1" className="text-right">
                Pricing 1
              </Label>
              <div className="flex flex-col col-span-3 gap-2">
                <div className="w-full flex gap-2">
                  <Controller
                    name="opening_hour_1"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedFrom(value);
                        }}
                        defaultValue={room.slots[0]?.startTime}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {fromOptions.map((option, index) => (
                              <SelectItem value={option} key={index}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Controller
                    name="closing_hour_1"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedTo(value);
                        }}
                        defaultValue={room.slots[0]?.endTime}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="To" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {toOptions.map((option, index) => (
                              <SelectItem value={option} key={index}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <Input
                  {...register("pricing_1", { required: true })}
                  id="pricing_1"
                  placeholder="Pricing"
                  className="col-span-3"
                  type="number"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="opening_hour_2" className="text-right">
                Pricing 2
              </Label>
              <div className="flex flex-col col-span-3 gap-2">
                <div className="w-full flex gap-2">
                  <Controller
                    name="opening_hour_2"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedFrom2(value);
                        }}
                        defaultValue={room.slots[1]?.startTime || ""}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {fromOptions2.map((option, index) => (
                              <SelectItem value={option} key={index}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Controller
                    name="closing_hour_2"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedTo2(value);
                        }}
                        defaultValue={room.slots[1]?.endTime || ""}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="To" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {toOptions2.map((option, index) => (
                              <SelectItem value={option} key={index}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <Input
                  {...register("pricing_2", { required: false })}
                  id="pricing_2"
                  placeholder="Pricing"
                  className="col-span-3"
                  type="number"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
