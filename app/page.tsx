"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";
import PromoSection from "@/components/ui/promo-section";
import NightlifeSlider from "@/components/ui/slider";

export default function Home() {
  const [date, setDate] = useState<Date>();
  const locations = ["BIRMINGHAM", "MAYFAIR", "SOHO", "SMITHFIELD"];

  const slides = [
    { src: "/experience-1.jpg", alt: "Nightlife in the city" },
    { src: "/experience-2.jpg", alt: "Karaoke bar with neon lights" },
    { src: "/experience-3.jpg", alt: "Cocktail drinks at a bar" },
    { src: "/experience-4.jpg", alt: "Friends singing karaoke" },
    { src: "/experience-5.jpg", alt: "Friends singing karaoke" },
  ];

  return (
    <div className="bg-black mt-16">
      <div>
        <section className="relative h-screen w-full overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 min-w-full min-h-full object-cover z-0"
          >
            <source src="/experience-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Pink Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-kb-pink bg-opacity-50 z-10"></div>

          {/* Content */}
          <div className="relative container max-w-[1200px] z-20 gap-8 grid grid-cols-1 md:grid-cols-2 items-center justify-center h-full">
            <div>
              <h3 className="uppercase text-lg text-white">KARAOKE BOX</h3>
              <h1 className="text-4xl font-bold text-white mt-4 mb-12">
                Unleash your inner superstar at the ultimate karaoke experience
                in the heart of London
              </h1>
              <Button
                className="bg-kb-secondary hover:bg-kb-primary text-white w-fit rounded-none"
                asChild
              >
                <a href="/">EXPLORE MORE</a>
              </Button>
            </div>

            <div className="bg-white/30 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Book Now</h2>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="venue"
                    className="block text-sm font-medium text-white"
                  >
                    Select Venue
                  </label>
                  <Select>
                    <SelectTrigger id="venue" className="w-full bg-white">
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="birmingham">Birmingham</SelectItem>
                      <SelectItem value="london">London</SelectItem>
                      <SelectItem value="manchester">Manchester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-white"
                  >
                    Select Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="start-time"
                      className="block text-sm font-medium text-white"
                    >
                      Start Time
                    </label>
                    <Input
                      type="time"
                      id="start-time"
                      className="w-full bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="end-time"
                      className="block text-sm font-medium text-white"
                    >
                      End Time
                    </label>
                    <Input
                      type="time"
                      id="end-time"
                      className="w-full bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="persons"
                    className="block text-sm font-medium text-white"
                  >
                    Persons
                  </label>
                  <Select>
                    <SelectTrigger id="persons" className="w-full bg-white">
                      <SelectValue placeholder="Select number of persons" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 11 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                >
                  BOOK NOW
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-kb-primary max-w-[1000px] mx-auto relative -top-[50px] z-[30] text-white py-16 px-4 md:px-8 lg:px-16">
        {/* Centered MapPin Icon */}
        <div className="bg-white rounded-full p-6 inline-block mb-6 absolute z-[40] -top-[50px] left-1/2 transform -translate-x-1/2">
          <MapPin className="w-12 h-12 text-kb-secondary" />
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto text-center relative z-[20] mt-8">
          <h2 className="text-3xl font-bold mb-4">Our Fancy Locations</h2>
          <p className="mb-8 text-lg opacity-100">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {locations.map((location) => (
              <Button
                key={location}
                className="bg-white text-purple-800 hover:bg-kb-secondary hover:text-white transition-colors duration-300 rounded-none"
              >
                {location}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <PromoSection
        imageUrl={"/promo-1.png"}
        imageAlt=""
        stepText="STEP INTO"
        headingStart="Step into a World of Singing, Laughter, and Pure Entertainment at"
        headingHighlight="Karaoke Box"
        headingEnd="!"
        description="Karaoke Box is the premier destination for music lovers, party enthusiasts, and those looking to create unforgettable memories with friends and family. Step into our world of singing, laughter, and pure entertainment."
        buttonText="BOOK NOW"
        buttonLink="/"
      ></PromoSection>

      <div
        className="h-[400px] my-20 bg-contain bg-no-repeat bg-center flex flex-col gap-4 justify-center items-center"
        style={{ backgroundImage: "url('/promo-cover.png')" }}
      >
        <h1 className="text-white font-bold text-4xl">VR EXPERIENCE</h1>
        <p className="text-white font-medium uppercase text-2xl text-center max-w-[300px] md:max-w-full">
          Smithfield 12 Smithfield Street, London EC1a 9lal
        </p>
        <Button
          className="bg-white text-kb-secondary hover:bg-kb-primary hover:text-white  w-fit rounded-none"
          asChild
        >
          <a href="/">EXPLORE MORE</a>
        </Button>
      </div>

      <PromoSection
        imageUrl={"/promo-2.png"}
        imageAlt=""
        stepText="NIGHTLIFE"
        headingStart="Elevate Your Nightlife with London's Premier"
        headingHighlight="Karaoke"
        headingEnd="Venue"
        description="Karaoke Box is the premier destination for music lovers, party enthusiasts, and those looking to create unforgettable memories with friends and family. Step into our world of singing, laughter, and pure entertainment."
        buttonText="BOOK NOW"
        buttonLink="/"
        imageOnLeft={false}
      ></PromoSection>

      <div>
        <NightlifeSlider slides={slides} />
      </div>
    </div>
  );
}
