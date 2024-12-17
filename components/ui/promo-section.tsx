import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

interface PromoSectionProps {
  imageUrl: string
  imageAlt: string
  stepText: string
  headingStart: string
  headingHighlight: string
  headingEnd: string
  description: string
  buttonText: string
  buttonLink: string
  imageOnLeft?: boolean
}

export default function PromoSection({
  imageUrl,
  imageAlt,
  stepText,
  headingStart,
  headingHighlight,
  headingEnd,
  description,
  buttonText,
  buttonLink,
  imageOnLeft = true
}: PromoSectionProps) {
  const contentOrder = imageOnLeft ? 'md:order-last' : 'md:order-first'
  const imageOrder = imageOnLeft ? 'md:order-first' : 'md:order-last'

  return (
    <section className="bg-black text-white py-16">
      <div className="container max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className={`w-full md:w-1/2 ${imageOrder}`}>
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={600}
              height={400}
              className="rounded-lg object-contain w-full h-[400px]"
            />
          </div>
          <div className={`w-full md:w-1/2 ${contentOrder}`}>
            <h3 className="text-kb-secondary uppercase text-sm font-bold mb-2">{stepText}</h3>
            <h2 className="text-[28px] md:text-4xl font-bold mb-4">
              {headingStart} <span className="text-kb-secondary">{headingHighlight}</span> {headingEnd}
            </h2>
            <p className="mb-6 text-white">{description}</p>
            <Button 
              asChild
              className="bg-kb-secondary hover:bg-kb-primary text-white font-light py-4 px-6 rounded-none"
            >
              <a href={buttonLink}>{buttonText}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}