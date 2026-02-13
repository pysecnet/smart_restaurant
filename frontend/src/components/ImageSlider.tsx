import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Welcome to',
    subtitle: 'Dastarkhwan',
    description: 'Experience authentic Pakistani cuisine in a modern, elegant setting',
  },
{
  id: 2,
  image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  title: 'Savor the',
  subtitle: 'Traditional Flavors',
  description: 'Rich spices, time-honored recipes, and unforgettable taste',
},
{
  id: 3,
  image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  title: 'A Modern',
  subtitle: 'Dining Experience',
  description: 'Seamless digital ordering paired with warm, traditional hospitality',
},
];

const ImageSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  useEffect(() => {
    const nextIndex = (currentSlide + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [currentSlide]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-30%' : '30%', opacity: 0 }),
  };

  return (
    <div
    className="relative h-[85vh] min-h-[500px] max-h-[800px] overflow-hidden"
    onMouseEnter={() => setIsPaused(true)}
    onMouseLeave={() => setIsPaused(false)}
    >
    <AnimatePresence mode="wait" custom={direction}>
    <motion.div
    key={currentSlide}
    custom={direction}
    variants={slideVariants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    className="absolute inset-0"
    >
    <motion.img
    src={slides[currentSlide].image}
    alt={slides[currentSlide].subtitle}
    className="w-full h-full object-cover"
    loading="eager"
    initial={{ scale: 1.1 }}
    animate={{ scale: 1 }}
    transition={{ duration: 8, ease: 'linear' }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1a2233] via-[#1a2233]/40 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#1a2233]/60 to-transparent" />
    <div className="absolute inset-0 flex items-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
    <div className="max-w-2xl">
    <motion.p
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.6 }}
    className="text-[#FFD700] text-lg font-medium tracking-wider uppercase mb-2"
    >
    {slides[currentSlide].title}
    </motion.p>
    <motion.h2
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35, duration: 0.6 }}
    className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
    >
    {slides[currentSlide].subtitle}
    </motion.h2>
    <motion.p
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.6 }}
    className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed max-w-lg"
    >
    {slides[currentSlide].description}
    </motion.p>
    <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.65, duration: 0.6 }}
    className="flex flex-wrap gap-4"
    >
    <a href="/menu" className="px-8 py-3.5 bg-[#FFD700] text-[#1a2233] rounded-lg font-semibold hover:bg-[#e6c200] shadow-lg hover:shadow-xl transition-all">
    Explore Menu
    </a>
    <a href="/reservation" className="px-8 py-3.5 border border-white/25 text-white rounded-lg font-medium hover:bg-white/10 backdrop-blur-sm transition-all">
    Reserve a Table
    </a>
    </motion.div>
    </div>
    </div>
    </div>
    </motion.div>
    </AnimatePresence>

    {/* Navigation Arrows */}
    <button onClick={prevSlide} className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all group border border-white/10" aria-label="Previous slide">
    <ChevronLeftIcon className="h-5 w-5 text-white" />
    </button>
    <button onClick={nextSlide} className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all group border border-white/10" aria-label="Next slide">
    <ChevronRightIcon className="h-5 w-5 text-white" />
    </button>

    {/* Progress Dots */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
    {slides.map((_, index) => (
      <button
      key={index}
      onClick={() => { setDirection(index > currentSlide ? 1 : -1); setCurrentSlide(index); }}
      className="group relative p-1"
      aria-label={`Go to slide ${index + 1}`}
      >
      <div className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-10 bg-[#FFD700]' : 'w-3 bg-white/40 group-hover:bg-white/70'}`} />
      </button>
    ))}
    </div>
    </div>
  );
};

export default ImageSlider;
