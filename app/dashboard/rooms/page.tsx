"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import { Rooms, getColumns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { DateTime } from "luxon";
import { EditDialog } from "./EditDialog";

const Page = () => {
  const [selectedSite, setSelectedSite] = useState("");
  const [roomModal, setRoomModal] = useState(false);
  const [editRoom, setEditRoom] = useState<Rooms | null>(null);
  const [fromOptions, setFromOptions] = useState<string[]>([]);
  const [toOptions, setToOptions] = useState<string[]>([]);
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [fromOptions2, setFromOptions2] = useState<string[]>([]);
  const [toOptions2, setToOptions2] = useState<string[]>([]);
  const [selectedFrom2, setSelectedFrom2] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();

  const handleEdit = (room: Rooms) => {
    setEditRoom(room);
  };

  const handleCloseEditDialog = () => {
    setEditRoom(null);
  };

  const generateHourOptions = (opening: string, closing: string) => {
    const openingHour = DateTime.fromFormat(opening, "HH:mm").hour;
    const closingHour = DateTime.fromFormat(closing, "HH:mm").hour;
    let hours = [];

    if (closingHour < openingHour) {
      for (let i = openingHour; i < 24; i++) {
        hours.push(DateTime.fromObject({ hour: i }).toFormat("HH:mm"));
      }
      for (let i = 0; i <= closingHour; i++) {
        hours.push(DateTime.fromObject({ hour: i }).toFormat("HH:mm"));
      }
    } else {
      for (let i = openingHour; i <= closingHour; i++) {
        hours.push(DateTime.fromObject({ hour: i }).toFormat("HH:mm"));
      }
    }
    return hours;
  };

  const mutation = useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sites", "rooms"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      reset();
      setRoomModal(false);
      toast.success(`Successfully added a new room`, {
        position: "top-center",
      });
    },
    onError: (error) => {
      toast.error(`Error while creating the room`, {
        position: "top-center",
      });
    },
    mutationFn: (formData: any) => {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key] !== undefined) {
          if (key === "openingHours") {
            data.append(key, JSON.stringify(formData[key]));
          } else {
            data.append(key, formData[key]);
          }
        }
      }
      if (selectedFile) {
        data.append("file", selectedFile);
      }
      return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/rooms`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
      siteId: selectedSite,
    });
  };

  const { data: sites = [] } = useQuery({
    queryKey: ["sites"],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sites`)
        .then((res) => res.data),
  });

  const { data: dataRoom = [] } = useQuery({
    queryKey: ["rooms", selectedSite],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sites/${selectedSite}/rooms`)
        .then((res) => res.data),
    refetchOnWindowFocus: true,
    enabled: !!selectedSite,
  });

  useEffect(() => {
    if (selectedSite) {
      const site = sites.find((site: any) => site.id === selectedSite);
      if (site) {
        const hours = generateHourOptions(site.openingHours, site.closingHours);
        setFromOptions([hours[0]]);
      }
    }
  }, [selectedSite, sites]);

  useEffect(() => {
    if (selectedFrom) {
      const site = sites.find((site: any) => site.id === selectedSite);
      if (site) {
        const selectedHour = DateTime.fromFormat(selectedFrom, "HH:mm").hour;
        const closingHour = DateTime.fromFormat(
          site.closingHours,
          "HH:mm"
        ).hour;
        const hours = Array.from(
          {
            length:
              closingHour -
              selectedHour +
              (closingHour < selectedHour ? 24 : 0),
          },
          (_, i) =>
            DateTime.fromObject({ hour: (selectedHour + i + 1) % 24 }).toFormat(
              "HH:mm"
            )
        );
        setToOptions(hours);
      }
    }
  }, [selectedFrom, selectedSite, sites]);

  useEffect(() => {
    if (selectedTo) {
      const site = sites.find((site: any) => site.id === selectedSite);
      if (site) {
        const selectedHour = DateTime.fromFormat(selectedTo, "HH:mm").hour;
        const closingHour = DateTime.fromFormat(
          site.closingHours,
          "HH:mm"
        ).hour;
        const hours = Array.from(
          {
            length:
              closingHour -
              selectedHour +
              (closingHour < selectedHour ? 24 : 0),
          },
          (_, i) =>
            DateTime.fromObject({ hour: (selectedHour + i + 1) % 24 }).toFormat(
              "HH:mm"
            )
        );
        setFromOptions2([hours[0]]);
      }
    }
  }, [selectedTo, selectedSite, sites]);

  useEffect(() => {
    if (selectedFrom2) {
      const site = sites.find((site: any) => site.id === selectedSite);
      if (site) {
        const selectedHour = DateTime.fromFormat(selectedFrom2, "HH:mm").hour;
        const closingHour = DateTime.fromFormat(
          site.closingHours,
          "HH:mm"
        ).hour;
        const hours = Array.from(
          {
            length:
              closingHour -
              selectedHour +
              (closingHour < selectedHour ? 24 : 0),
          },
          (_, i) =>
            DateTime.fromObject({ hour: (selectedHour + i + 1) % 24 }).toFormat(
              "HH:mm"
            )
        );
        setToOptions2(hours);
      }
    }
  }, [selectedFrom2, selectedSite, sites]);

  const filtered = dataRoom?.rooms?.map((item: any) => {
    return {
      ...item,
      slot_1: item.slots?.[0]
        ? `${item.slots[0].startTime} - ${item.slots[0].endTime} | ${item.slots[0].pricing}£`
        : "not defined",
      slot_2: item.slots?.[1]
        ? `${item.slots[1].startTime} - ${item.slots[1].endTime} | ${item.slots[1].pricing}£`
        : "not defined",
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-medium mb-4">Manage Rooms</h1>

      <div className="flex justify-between items-center">
        <Select onValueChange={(item) => setSelectedSite(item)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a site" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {sites.map((item: any, index: number) => (
                <SelectItem value={item.id} key={index}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Dialog
          open={roomModal}
          onOpenChange={() => {
            setRoomModal(!roomModal);
            reset();
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-kb-primary hover:bg-kb-secondary"
              disabled={selectedSite == ""}
            >
              Add a room{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#FFFFFF"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="ml-2 w-6 h-6 text-white cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a new room</DialogTitle>
              <DialogDescription>
                Fill a name and upload an image
              </DialogDescription>
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
                    placeholder="Write a room name"
                    className="col-span-3"
                  />
                  {errors.name && (
                    <span className="text-red-500 -mt-2 text-xs col-start-2 col-end-4">
                      Name is required
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    className="col-span-3"
                    onChange={(e) =>
                      setSelectedFile(e.target.files ? e.target.files[0] : null)
                    }
                  />
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
                          <Select onValueChange={field.onChange}>
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="Capacity" className="text-right">
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
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {selectedSite && (
        <div className="px-4 py-2 border-[1.1px] border-black/10 shadow-sm mt-4 rounded-md">
          <h1 className="text-md font-medium mb-2">
            Selected site information:
          </h1>

          <div className="flex gap-1">
            <p className="font-medium text-sm">Name:</p>
            <p className="text-sm">{dataRoom?.name}</p>
          </div>
          <div className="flex gap-1">
            <p className="font-medium text-sm">Opens:</p>
            <p className="text-sm">{dataRoom?.openingHours}</p>
          </div>
          <div className="flex gap-1">
            <p className="font-medium text-sm">Closes:</p>
            <p className="text-sm">{dataRoom?.closingHours}</p>
          </div>
        </div>
      )}

      {selectedSite !== "" && (
        <div className="mt-8">
          <DataTable columns={getColumns(handleEdit)} data={filtered || []} />
        </div>
      )}
      {editRoom && (
        <EditDialog
          room={editRoom}
          onClose={handleCloseEditDialog}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ["rooms", selectedSite],
            });
            handleCloseEditDialog();
          }}
        />
      )}
    </div>
  );
};

export default Page;
