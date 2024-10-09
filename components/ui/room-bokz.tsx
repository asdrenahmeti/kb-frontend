"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, MinusCircle } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const drinks = [
  { id: 1, name: "Cola" },
  { id: 2, name: "Orange Juice" },
  { id: 3, name: "Lemonade" },
  { id: 4, name: "Water" },
];

type Props = {
  bookingModal: boolean;
  setBookingModal: (value: boolean) => void;
  roomId: any;
  booking: any;
};

type BookingData = {
  date: string;
  email: string;
  endTime: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roomId: string;
  startTime: string;
};

const fetchRoomData = async (roomId: any) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/rooms/${roomId}`
  );
  return data;
};

const createBooking = async (formData: BookingData) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/bookings`,
    formData
  );
  return response.data;
};

export default function RoomBookingModal({
  roomId,
  booking,
  bookingModal,
  setBookingModal,
}: Props) {
  const [selectedDrinks, setSelectedDrinks] = useState([
    { id: "", quantity: 1 },
  ]);
  const [currentStep, setCurrentStep] = useState("customer");
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  console.log(booking);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange", // Form validation mode
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success("Booking successful!");
      reset();
      setBookingModal(false);
    },
    onError: (error: AxiosError) => {
      toast.error(`Booking failed: ${error.message}`);
    },
  });

  const onSubmit = (data: any) => {
    const [hour, minute] = booking?.startTime.split(":");
    const [hourTime, minuteTime] = booking?.endTime?.split(":");

    const formattedStartTime =
      DateTime.fromObject({
        year: booking.date.getFullYear(),
        month: booking.date.getMonth() + 1,
        day: booking.date.getDate(),
        hour: parseInt(hour),
        minute: parseInt(minute),
      }).toISO({ includeOffset: false }) + "Z";

    const formattedEndTime =
      DateTime.fromObject({
        year: booking.date.getFullYear(),
        month: booking.date.getMonth() + 1,
        day: booking.date.getDate(),
        hour: parseInt(hourTime),
        minute: parseInt(minuteTime),
      }).toISO({ includeOffset: false }) + "Z";

    let inputDate =
      booking.date;

    let jsDate = new Date(inputDate);

    let dt = DateTime.fromJSDate(jsDate).setZone("utc", {
      keepLocalTime: true,
    });

    let outputDate = dt.toISO();

    const bookingData: BookingData = {
      date: outputDate,
      email: data.email,
      endTime: formattedEndTime,
      firstName: data.firstName,
      lastName: data.surname,
      phoneNumber: data.phoneNumber,
      roomId: roomId,
      startTime: formattedStartTime,
    };

    mutation.mutate(bookingData);
  };

  const { data: roomData, isLoading } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => fetchRoomData(roomId),
  });

  const addDrinkSelection = () => {
    setSelectedDrinks([...selectedDrinks, { id: "", quantity: 1 }]);
  };

  const updateDrinkSelection = (index: number, drinkId: string) => {
    const newSelections = [...selectedDrinks];
    newSelections[index].id = drinkId;
    setSelectedDrinks(newSelections);
    if (index === selectedDrinks.length - 1 && drinkId !== "") {
      addDrinkSelection();
    }
  };

  const updateDrinkQuantity = (index: number, change: number) => {
    const newSelections = [...selectedDrinks];
    newSelections[index].quantity = Math.max(
      1,
      newSelections[index].quantity + change
    );
    setSelectedDrinks(newSelections);
  };

  const handleContinue = () => {
    if (currentStep === "customer") {
      setCurrentStep("payment");
    }
  };

  return (
    <Dialog
      open={bookingModal}
      onOpenChange={(isOpen) => setBookingModal(false)}
    >
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Complete your booking</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{roomData?.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {DateTime.fromJSDate(new Date(booking.date)).toISODate()}
                  </p>
                  <div className="text-sm space-y-1">
                    <p>Start time: {booking?.startTime}</p>
                    <p>End time: {booking?.endTime}</p>
                    <p>Capacity: {roomData?.capacity}</p>
                  </div>
                  <p className="text-lg font-bold mt-2">$120</p>
                  <p className="text-xs text-gray-500">subtotal</p>
                </div>
                <div className="flex-1 space-y-4">
                  <h4 className="font-semibold">Select Drinks</h4>
                  {selectedDrinks.map((drink, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Select
                        value={drink.id}
                        onValueChange={(value) =>
                          updateDrinkSelection(index, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {drinks.map((d) => (
                            <SelectItem key={d.id} value={d.id.toString()}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {drink.id && (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateDrinkQuantity(index, -1)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span>{drink.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateDrinkQuantity(index, 1)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="relative w-40 h-40 rounded-md overflow-hidden">
                  {roomData && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/public/room-images/${roomData?.image}`}
                      alt="Room Image"
                      className="mt-4 rounded-br-3xl rounded-tl-3xl"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs
              value={currentStep}
              onValueChange={setCurrentStep}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">Customer Information</TabsTrigger>
                <TabsTrigger value="payment">Payment Information</TabsTrigger>
              </TabsList>
              <TabsContent value="customer">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Name"
                        {...register("firstName", {
                          required: "First Name is required",
                        })}
                      />
                      {errors.firstName && (
                        <p className="text-red-500">
                          {errors.firstName.message?.toString() ||
                            "Error occurred"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surname">Surname</Label>
                      <Input
                        id="surname"
                        placeholder="Surname"
                        {...register("surname", {
                          required: "Surname is required",
                        })}
                      />
                      {errors.surname && (
                        <p className="text-red-500">
                          {errors.surname.message?.toString() ||
                            "Error occurred"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <p className="text-red-500">
                        {errors.email.message?.toString() || "Error occurred"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone Number"
                      {...register("phone", {
                        required: "Phone number is required",
                      })}
                    />
                    {errors.phone && (
                      <p className="text-red-500">
                        {errors.phone.message?.toString() || "Error occurred"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="member" {...register("member")} />
                    <Label htmlFor="member">Become a member?</Label>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="payment">
                <div className="space-y-4">
                  {/* No validation here for the payment fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input id="cardholderName" placeholder="Name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="XXXX-XXXX-XXXX" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingAddress">Billing Address</Label>
                    <Input id="billingAddress" placeholder="Address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="mm/yyyy" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="XXX" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              type="submit"
            >
              {currentStep === "customer"
                ? "Continue to Payment Information"
                : "BOOK NOW"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
