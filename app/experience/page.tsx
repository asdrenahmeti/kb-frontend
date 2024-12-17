import EventCard from "@/components/ui/experience-section";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
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
        <div className="absolute top-0 left-0 w-full h-full bg-kb-primary bg-opacity-50 z-10"></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col gap-4 items-center justify-center h-full">
          <h1 className="text-3xl lg:text-[70px] font-bold text-center text-white">
            KARAOKE BOX EXPERIENCES
          </h1>
          <p className="text-center text-white text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. <br />{" "}
            Ut enim ad minim veniam.
          </p>
        </div>
      </section>

      <div className="bg-black pt-12">
        <EventCard
          imageUrl="/experience-1.jpg"
          title="Birthdays"
          shortDescription="Celebrate your special day in style with a Karaoke Birthday Bash!"
          longDescription="Gather your friends and family for an unforgettable party filled with music, laughter, and plenty of good vibes. Take the stage like a superstar, serenade the crowd with your favorite tunes, and dance the night away in our vibrant karaoke rooms. With delicious food, refreshing drinks, and a lively atmosphere, your birthday party at Karaoke Box is sure to be a hit!"
          buttonText="MORE INFO"
          buttonLink="/events/birthdays"
        />
        <EventCard
          imageUrl="/experience-2.jpg"
          title="Hen and Stag"
          shortDescription="Get ready for an epic pre-wedding bash at KaraokeBox!"
          longDescription="Say goodbye to ordinary and hello to an un-forgettable night of music, madness, and memories in the making. With private karaoke rooms, themed props, and tasty drinks, it’s the ultimate Hen Do or Stag Do destination. Let’s make it a night to remember!"
          buttonText="MORE INFO"
          buttonLink="/events/birthdays"
        />
        <EventCard
          imageUrl="/experience-3.jpg"
          title="Kids Party"
          shortDescription="Get ready to turn up the volume on fun with a Kids’
Karaoke Party at Karaoke Box! It’s time to unleash their inner rockstars for a birthday bash they’ll never forget."
          longDescription="With colourful decorations, tasty treats,
and a karaoke stage waiting for their spotlight moment,
it’s a celebration they’ll be talking about for weeks.
Let’s crank up the music and make some unforgettable memories together! destination. Let’s make it a night to remember!"
          buttonText="MORE INFO"
          buttonLink="/events/birthdays"
        />

        <EventCard
          imageUrl="/experience-4.jpg"
          title="Cocktail Masterclass"
          shortDescription="For an unforgettable Cocktail Master Class! "
          longDescription="Shake, stir, and sip your way through an evening of
            mixology magic. Learn the secrets behind crafting
            the perfect cocktail while enjoying expert guidance
            from our talented bartenders.
            Cheers to a night of
            fun, flavor, and newfound skills!"
          buttonText="MORE INFO"
          buttonLink="/events/birthdays"
        />

<EventCard
          imageUrl="/experience-5.jpg"
          title="Christmas"
          shortDescription="Get ready to rock around the Christmas tree at Karaoke Box!"
          longDescription="
        Christmas
        Get ready to rock around the Christmas tree at Karaoke Box!

        Join us with 2 hours for a holly jolly holiday bash filled with 
        festive tunes, tasty treats, and tons of cheer. With cozy
        karaoke rooms decked out in holiday decorations, it’s the
        ultimate Christmas party destination.

        Let’s sing, laugh, and make merry memories together!"
          buttonText="MORE INFO"
          buttonLink="/events/birthdays"
        />
      </div>
    </div>
  );
};

export default Page;
