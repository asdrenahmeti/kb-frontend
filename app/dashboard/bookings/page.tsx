"use client";

import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, PanelBottomOpen, PanelTopOpen } from "lucide-react";
import { format } from "date-fns";
import CurrentTimeLine from "./CurrentTimeLine";
import BookingGrid from "./BookingGrid";
import AddBooking from "./AddBooking";
import DragConfirmModal from "./DragConfirmModal";
import ChangeBookingModal from "./ChangeBookingModal";
import { toast } from "sonner";
import DeleteBookingModal from "./DeleteBookingModal";
import NotesModal from "./NotesModal";
import { useSession } from "next-auth/react";

interface BookingData {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  roomId: string;
  [key: string]: any;
}

interface NewBookingData {
  startTime: string;
  roomId: string;
  [key: string]: any;
}

interface Site {
  id: string;
  name: string;
}

const calculateScrollPosition = (
  startHour: string,
  currentTime: DateTime
): number => {
  const startTime = DateTime.fromFormat(startHour, "HH:mm");
  const targetTime = currentTime.minus({ hours: 1 });

  const diffInMinutes = targetTime.diff(startTime, "minutes").minutes;
  const scrollPosition = (diffInMinutes / 5) * 30;

  return scrollPosition;
};

const Page: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [startHour, setStartHour] = useState<string>("");
  const [endHour, setEndHour] = useState<string>("");
  const [bookingModal, setBookingModal] = useState<boolean>(false);
  const [newBooking, setNewBooking] = useState<NewBookingData | null>(null);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [draggedBooking, setDraggedBooking] = useState<any>(null);
  const [showDragConfirmModal, setShowDragConfirmModal] =
    useState<boolean>(false);
  const [cancelDrag, setCancelDrag] = useState<boolean>(false);
  const [resetPosition, setResetPosition] = useState<boolean>(false);
  const [showChangeBookingModal, setShowChangeBookingModal] =
    useState<boolean>(false);
  const [showDeleteBookingModal, setShowDeleteBookingModal] =
    useState<boolean>(false);
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const { data: session, status } = useSession();


  const currentDate = date ? DateTime.fromJSDate(date).toISODate() : "";

  const queryClient = useQueryClient();

  const mutation = useMutation({
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `${(error?.response?.data as { message?: string })?.message}`,
          {
            position: "top-center",
          }
        );
      } else {
        console.error("An error occurred:", error.message);
      }
    },
    mutationFn: ({ id, ...booking }: BookingData) => {
      return axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${id}`,
        booking
      );
    },
  });

  const handleConfirmDrag = (newBooking: BookingData) => {
    setShowDragConfirmModal(false);
    setCancelDrag(false);
    setResetPosition(false);

    const { id, date, startTime, endTime, roomId, ...rest } = newBooking;

    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");

    const bookingDate = DateTime.fromISO(date, { zone: "utc" });

    const formattedStartTime =
      DateTime.fromObject(
        {
          year: bookingDate.year,
          month: bookingDate.month,
          day: bookingDate.day,
          hour: parseInt(startHour),
          minute: parseInt(startMinute),
        },
        { zone: "utc" }
      ).toISO({ includeOffset: false }) + "Z";

    // Calculate the end time based on the start time and duration
    let startDateTime = DateTime.fromISO(formattedStartTime, { zone: "utc" });
    let endDateTime = startDateTime.plus({
      hours: parseInt(endHour) - parseInt(startHour),
      minutes: parseInt(endMinute) - parseInt(startMinute),
    });

    // Adjust the date if the new start time is before the opening hour or after the closing hour
    const siteStartDateTime = DateTime.fromFormat(startHour, "HH:mm", {
      zone: "utc",
    });
    const siteEndDateTime = DateTime.fromFormat(endHour, "HH:mm", {
      zone: "utc",
    });

    if (startDateTime < siteStartDateTime) {
      startDateTime = startDateTime.plus({ days: 1 });
      endDateTime = endDateTime.plus({ days: 1 });
    } else if (
      startDateTime >= siteEndDateTime &&
      siteEndDateTime < siteStartDateTime
    ) {
      startDateTime = startDateTime.plus({ days: 1 });
      endDateTime = endDateTime.plus({ days: 1 });
    }

    const formattedBooking: BookingData = {
      id,
      startTime: startDateTime.toISO({ includeOffset: false }) + "Z",
      endTime: endDateTime.toISO({ includeOffset: false }) + "Z",
      date: startDateTime.toISODate() + "T00:00:00.000Z", // Ensure the date is in ISO-8601 format with 'Z'
      roomId, // Ensure the new roomId is included
      userId: session?.user?.id,
      ...rest,
    };

    mutation.mutate(formattedBooking);
  };

  const handleCloseModal = () => {
    setShowDragConfirmModal(false);
    setCancelDrag(true);
    setResetPosition(true);
    setTimeout(() => {
      setResetPosition(false);
    }, 300);
  };

  const fetchData = async (): Promise<any> => {
    if (!date || !selectedSite) return;

    const isoDateString =
      DateTime.fromObject({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: 0,
        minute: 0,
        second: 0,
      }).toISO({ includeOffset: false }) + "Z";

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings?gt=${isoDateString}&siteId=${selectedSite}`
      );
      const data = res.data;
      setStartHour(data?.openingHours);
      setEndHour(data?.closingHours);
      return data;
    } catch (error) {
      console.error("Error fetching bookings data:", error);
      return null;
    }
  };

  const { data, isFetching } = useQuery({
    queryKey: ["bookings", date, selectedSite],
    queryFn: fetchData,
    enabled: !!selectedSite && !!date,
  });

  const { data: sitesData } = useQuery({
    queryKey: ["sites"],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sites`)
        .then((res) => res.data),
  });

  const handleBoxClick = (time: string, roomId: string, roomName: string) => {
    const selectedDateTime = DateTime.fromFormat(time, "HH:mm", {
      zone: "utc",
    });
    const startDateTime = DateTime.fromFormat(startHour, "HH:mm", {
      zone: "utc",
    });

    // Adjust the date if the selected time is before the start hour
    const selectedDate =
      selectedDateTime < startDateTime
        ? DateTime.fromJSDate(date as Date)
            .plus({ days: 1 })
            .toISODate()
        : DateTime.fromJSDate(date as Date).toISODate();

    const newBooking = {
      date: selectedDate,
      startTime: selectedDateTime.toFormat("HH:mm"),
      roomId: roomId,
      roomName: roomName,
    };

    setNewBooking(newBooking);
    setBookingModal(true);
  };

  const handleBoxDrag = (
    momentaryPosition: { x: number; y: number },
    roomId: string,
    bookingStartTime: string
  ) => {
    const timeIntervalInMinutes = 5;
    const boxWidth = 30;

    const startDateTime = DateTime.fromFormat(startHour, "HH:mm", {
      zone: "utc",
    });
    const bookingStartDateTime = DateTime.fromISO(bookingStartTime, {
      zone: "utc",
    });

    const initialMinutesFromStart = bookingStartDateTime.diff(
      startDateTime,
      "minutes"
    ).minutes;
    const initialLeft =
      (initialMinutesFromStart / timeIntervalInMinutes) * boxWidth;

    const relativePositionX = momentaryPosition.x;

    const totalMinutesFromStart =
      initialMinutesFromStart +
      (relativePositionX / boxWidth) * timeIntervalInMinutes;

    const momentaryTime = startDateTime.plus({
      minutes: totalMinutesFromStart,
    });

    // Determine the new date based on the new time
    let newStartTime = momentaryTime.set({
      year: bookingStartDateTime.year,
      month: bookingStartDateTime.month,
      day: bookingStartDateTime.day,
    });

    // If the new start time is before the start hour, it should be on the next day
    if (newStartTime < startDateTime) {
      newStartTime = newStartTime.plus({ days: 1 });
    }

    // Adjust the date if the new start time is after the end hour
    const endDateTime = DateTime.fromFormat(endHour, "HH:mm", {
      zone: "utc",
    });
    if (newStartTime >= endDateTime && endDateTime < startDateTime) {
      newStartTime = newStartTime.plus({ days: 1 });
    }

    const newBooking = {
      date: newStartTime.toISODate(),
      startTime: newStartTime.toISO(),
      roomId: roomId,
    };

    setDraggedBooking({
      old: {
        id: "",
        startTime: bookingStartTime,
        endTime: "",
        date: bookingStartDateTime.toISODate(),
      },
      new: newBooking,
    });
    setShowDragConfirmModal(true);

    return newBooking;
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  }, [date, selectedSite]);

  useEffect(() => {
    if (startHour && endHour) {
      const currentTime = DateTime.local();
      const scrollPosition = calculateScrollPosition(startHour, currentTime);
      const container = document.querySelector(".w-full.overflow-auto");
      if (container) {
        container.scrollLeft = scrollPosition;
      }
    }
  }, [startHour, endHour]);

  useEffect(() => {
    if (activeBooking) {
      setIsCollapsed(false);
    }
  }, [activeBooking]);

  return (
    <>
      <div className="relative h-full">
        <h1 className="text-2xl font-medium mb-4">Bookings</h1>
        <div className="flex gap-4 mb-4">
          <Select onValueChange={(item) => setSelectedSite(item)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a site" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sitesData?.map((item: Site, index: number) => (
                  <SelectItem value={item.id} key={index}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full overflow-auto relative">
          {selectedSite && (
            <>
              <CurrentTimeLine startHour={startHour} />
              <BookingGrid
                data={data}
                startHour={startHour}
                endHour={endHour}
                handleBoxClick={handleBoxClick}
                handleBoxDrag={handleBoxDrag}
                setActiveBooking={setActiveBooking}
                setDraggedBooking={setDraggedBooking}
                setShowDragConfirmModal={setShowDragConfirmModal}
                cancelDrag={cancelDrag}
                resetPosition={resetPosition}
                currentDate={currentDate}
              />
            </>
          )}
        </div>

        <div
          className={`w-full shadow-xl border-[1px] bg-kb-primary/20 border-black/10 absolute bottom-0 overflow-hidden rounded-tl-xl rounded-tr-xl transition-height duration-300 ${
            isCollapsed ? "h-[38px]" : "h-[240px]"
          }`}
        >
          <div className="flex justify-between items-center bg-kb-primary px-4 py-2 text-white">
            <p className="font-medium">
              {activeBooking
                ? `Active Selected Booking - ${activeBooking?.booking?.id}`
                : "No Active Booking"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-blue-500"
              >
                {isCollapsed ? (
                  <PanelBottomOpen color="white" />
                ) : (
                  <PanelTopOpen color="white" />
                )}
              </button>
            </div>
          </div>
          {!isCollapsed && activeBooking && (
            <div className="grid grid-cols-3 gap-4 p-4">
              <div className="col-span-1">
                <div className="flex flex-col ">
                  <div className="flex">
                    <p className="font-medium min-w-[100px]">User:</p>
                    <p className="font-light">
                      {activeBooking?.booking?.user?.firstName || "not defined"}{" "}
                      {activeBooking?.booking?.user?.lastName || "not defined"}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="font-medium min-w-[100px]">Email:</p>
                    <p className="font-light">
                      {activeBooking?.booking?.user?.email || "not defined"}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="font-medium min-w-[100px]">Phone:</p>
                    <p className="font-light">
                      {activeBooking?.booking?.user?.phone_number ||
                        "not defined"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <p className="font-medium min-w-[100px]">Status:</p>
                  <p className="font-light">{activeBooking?.booking?.status}</p>
                </div>
                <div className="flex gap-2">
                  <p className="font-medium min-w-[100px]">Start time:</p>
                  <p className="font-light">
                    {DateTime.fromISO(activeBooking?.booking?.startTime)
                      .toUTC()
                      .toFormat("HH:mm")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="font-medium min-w-[100px]">End time:</p>
                  <p className="font-light">
                    {DateTime.fromISO(activeBooking?.booking?.endTime)
                      .toUTC()
                      .toFormat("HH:mm")}
                  </p>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex gap-2">
                  <p className="font-medium min-w-[100px]">Room:</p>
                  <p className="font-light">{activeBooking?.room?.name}</p>
                </div>
                <div className="flex gap-2">
                  <p className="font-medium min-w-[100px]">Capacity:</p>
                  <p className="font-light">{activeBooking?.room?.capacity}</p>
                </div>
              </div>
              <div className="col-span-1 grid-rows-3 grid max-w-[200px]">
                {activeBooking && (
                  <Button
                    onClick={() => setShowChangeBookingModal(true)}
                    className=" bg-kb-primary hover:bg-kb-secondary"
                  >
                    Change Booking
                  </Button>
                )}

                {activeBooking && (
                  <Button
                    onClick={() => setShowNotesModal(true)}
                    className="bg-kb-primary hover:bg-kb-secondary"
                  >
                    Notes
                  </Button>
                )}

                {activeBooking && (
                  <Button
                    onClick={() => setShowDeleteBookingModal(true)}
                    className=" bg-kb-primary hover:bg-kb-secondary"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {showDragConfirmModal && draggedBooking && (
          <DragConfirmModal
            showModal={showDragConfirmModal}
            setShowModal={setShowDragConfirmModal}
            oldBooking={draggedBooking.old}
            newBooking={draggedBooking.new}
            handleConfirm={handleConfirmDrag}
            handleCancel={handleCloseModal}
          />
        )}

        {bookingModal && (
          <AddBooking
            bookingModal={bookingModal}
            setBookingModal={setBookingModal}
            booking={newBooking}
            site={selectedSite}
            date={date}
          />
        )}

        {showChangeBookingModal && activeBooking && (
          <ChangeBookingModal
            showModal={showChangeBookingModal}
            setShowModal={setShowChangeBookingModal}
            booking={activeBooking.booking}
            setActiveBooking={setActiveBooking}
          />
        )}

        {showDeleteBookingModal && activeBooking && (
          <DeleteBookingModal
            showModal={showDeleteBookingModal}
            setShowModal={setShowDeleteBookingModal}
            bookingId={activeBooking.booking.id}
            setActiveBooking={setActiveBooking}
          />
        )}

        {showNotesModal && activeBooking && (
          <NotesModal
            showModal={showNotesModal}
            setShowModal={setShowNotesModal}
            bookingId={activeBooking.booking.id}
          />
        )}
      </div>
    </>
  );
};

export default Page;
