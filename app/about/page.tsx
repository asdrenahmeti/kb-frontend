"use client";

import AboutSectionItem from "@/components/ui/about-section-item";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="bg-black">
     
     <AboutSectionItem
        image="/slide-1.jpg"
        color="dark"
      >
        <img src="/white-logo.png" className="mx-auto mb-8"></img>
        <h1 className="text-center text-[70px] text-white font-bold">Our story</h1>
        <p className="text-center text-[30px] text-white">We go back since 1997
        </p>
      </AboutSectionItem>

      <AboutSectionItem
        textOne="Hey there, fellow music aficionado! Welcome to Karaoke Box – your home away from home, where every note is a celebration of life and every song is a journey into pure joy."
        image="/slide-1.jpg"
        color="light"
      />
      <AboutSectionItem
        textOne="Let me share a bit of our story with you. It all started back in 1997, right in the heart of Soho. What began as a humble restaurant soon transformed into the karaoke hotspot that you see today. And let me tell you, we’ve never looked back since. From Soho, we’ve expanded to Smithfield, Mayfair, and even Birmingham, spreading the karaoke love far and wide."
        image="/slide-1.jpg"
        color="dark"
      />
      <AboutSectionItem
        textOne="But enough about us – let’s talk about you. Whether you’re a seasoned performer who knows how to work the crowd, a casual shower-singing superstar, or just someone looking to inject some excitement into your gatherings, Karaoke Box has got your back."
        image="/slide-1.jpg"
        color="light"
      />
      <AboutSectionItem
        textOne="Step into one of our high-tech karaoke rooms, and you’ll find yourself surrounded by a world of musical possibilities. From classic hits that’ll transport you back in time to the latest chart-toppers that’ll have you dancing ’til dawn, our extensive library of tracks has something for everyone."
        image="/slide-1.jpg"
        color="dark"
      />
      <AboutSectionItem
        textOne="But what truly sets Karaoke Box apart is the sense of community that fills our halls. Here, you’re not just another customer – you’re part of a family of music lovers, performers, and party enthusiasts who live for those magical moments on stage."
        textTwo="So whether you’re looking to polish your performance skills, plan the ultimate party, or simply let your hair down and sing your heart out, Karaoke Box is your one-stop destination for all things karaoke."
        image="/slide-1.jpg"
        color="light"
      />
      <AboutSectionItem
        image="/slide-1.jpg"
        color="dark"
      >
        <img src="/white-logo.png" className="mx-auto mb-8"></img>
        <h1 className="text-center text-[70px] text-white font-bold">Come join us!</h1>
        <p className="text-center text-[30px] text-white">Join us on this musical journey, and let's make every moment a karaoke moment together!
        </p>
        <div className="flex justify-center mt-8">
        <Button className="bg-white text-md px-8 text-kb-secondary hover:bg-kb-primary hover:text-white rounded-none">SIGN UP</Button>
        </div>
      </AboutSectionItem>
    </div>
  );
}
