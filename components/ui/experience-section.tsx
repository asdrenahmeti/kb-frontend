import React from 'react'
import { Button } from "@/components/ui/button"

interface EventCardProps {
  imageUrl: string
  title: string
  shortDescription: string
  longDescription: string
  buttonText: string
  buttonLink: string
}

export default function EventCard({
  imageUrl,
  title,
  shortDescription,
  longDescription,
  buttonText,
  buttonLink
}: EventCardProps) {
  return (
    <div className="flex flex-col lg:flex-row bg-black text-white px-8 py lg:px-20 lg:py-24 max-w-[1400px] mx-auto">
      <div className="w-full lg:w-1/2">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="lg:w-1/2 pt-4 lg:ml-8 lg:p-8 flex flex-col justify-center mb-16">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl mb-4">{shortDescription}</p>
        <p className="mb-6">{longDescription}</p>
        <Button 
          className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white w-fit"
          asChild
        >
          <a href={buttonLink}>{buttonText}</a>
        </Button>
      </div>
    </div>
  )
}