// app/components/AnimatedSlider.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: '/slide-1.jpg',
    title:
      'Unleash your inner superstar at the ultimate karaoke experience in the heart of London',
    description:
      'Karaoke Box is the premier destination for music lovers, party enthusiasts, and those looking to create unforgettable memories with friends and family. Step into our world of singing, laughter, and pure entertainment.'
  },
  {
    id: 2,
    image: '/slide-2.jpg',
    title: `Elevate Your Nightlife with London's Premier Karaoke Venue`,
    description:
      'Whether you’re a seasoned karaoke pro or a first-time singer, Karaoke Box offers an experience like no other. With an extensive library of songs spanning various genres and languages, you’ll find the perfect track to showcase your vocal talents.'
  },
  {
    id: 3,
    image: '/slide-3.jpg',
    title: `Step into a World of Singing`,
    description:
      'Karaoke Box is the premier destination for music lovers, party enthusiasts, and those looking to create unforgettable memories with friends and family. Step into our world of singing, laughter, and pure entertainment.'
  }
];

const AnimatedSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleDragEnd = (event: MouseEvent | TouchEvent, info: any) => {
    if (info.offset.x > 50) {
      // Dragged to the right
      setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    } else if (info.offset.x < -50) {
      // Dragged to the left
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className='relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] xl:h-[500px] overflow-hidden cursor-pointer'>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: index === currentSlide ? 1.1 : 1 }}
            transition={{ duration: 5 }}
            className='absolute inset-0'
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          ></motion.div>
          {index === currentSlide && (
            <div className='absolute inset-0 flex flex-col justify-center items-start bg-black bg-opacity-50 p-4 sm:p-8'>
              <div className='w-full max-w-[80%] mx-auto'>
                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className='text-2xl sm:text-4xl md:text-5xl lg:text-4xl md:max-w-[50%] text-white font-bold'
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className='mt-2 sm:mt-4 text-sm sm:text-lg md:text-xl lg:text-xl md:max-w-[50%] text-white'
                >
                  {slide.description}
                </motion.p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnimatedSlider;
