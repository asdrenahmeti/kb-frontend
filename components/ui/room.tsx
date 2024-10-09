import React from "react";
import { Button } from "./button";

interface RoomProps {
  imageUrl: string;
  roomName: string;
  capacity: number;
  price: Price[];
  setSelectedRoom: (id: string | number) => void;
  id: string | number;
  setBookingModal: (value: boolean) => void;
}

interface Price {
  startTime: string;
  endTime: string;
  pricing: number;
}

const Room: React.FC<RoomProps> = ({
  imageUrl,
  roomName,
  capacity,
  price,
  setBookingModal,
  setSelectedRoom,
  id,
}) => {
  return (
    <div className="flex flex-col w-full overflow-hidden shadow-md relative">
      <div className="relative overflow-hidden group">
        <img
          src={imageUrl}
          alt={roomName}
          className="w-full h-52 object-cover transition-transform duration-300 transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-2 right-2 bg-purple-700 text-white px-2 py-1 rounded">
          {price.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className="text-xs grid max-w-[200px] grid-cols-[90px_30px]"
              >
                <p className="border-r-2">
                  {item.startTime} to {item.endTime}
                </p>{" "}
                <p className="text-right">{item.pricing} £</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-4 flex flex-row justify-between items-center">
        <div className="">
          <h2 className="text-2xl text-white font-semibold">{roomName}</h2>
          <p className="text-gray-200">{capacity} Persons</p>
        </div>
        <Button
          onClick={() => {
            setSelectedRoom(id);
            setBookingModal(true);
          }}
          type="submit"
          className="bg-kb-secondary hover:bg-kb-secondary rounded-none"
        >
          Book now
        </Button>
      </div>
    </div>
  );
};

export default Room;
