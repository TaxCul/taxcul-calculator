"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import { Autoplay, Navigation, EffectCoverflow } from "swiper/modules";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const screenshots = [
  {
    src: "/screenshots/calc3.png",
    title: "Tax Planning Dashboard",
    description: "Comprehensive tax planning with real-time calculations"
  },
  {
    src: "/screenshots/calc2.png",
    title: "Corporate Tax Calculator",
    description: "Advanced business tax computations"
  },
  {
    src: "/screenshots/calc1.png",
    title: "Individual Income Tax",
    description: "Personal tax planning and optimization"
  }
];

export default function ShowcaseCarousel() {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleAutoplay = () => {
    if (swiperInstance) {
      if (isPlaying) {
        swiperInstance.autoplay.stop();
      } else {
        swiperInstance.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const goNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  if (!mounted) {
    return (
      <section className="mb-20 py-16 bg-gray-800/20 rounded-3xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-700 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-48 mx-auto animate-pulse"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-700 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-20 py-16 bg-gradient-to-br from-gray-800/30 to-gray-900/50 rounded-3xl border border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-lime-400 mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our powerful tax calculation tools through interactive screenshots
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Custom Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10">
            <button
              onClick={goPrev}
              className="p-3 bg-gray-800/80 backdrop-blur-sm rounded-full border border-lime-400/30 
                         text-lime-400 hover:bg-lime-400 hover:text-gray-900 transition-all duration-300 
                         shadow-lg hover:shadow-lime-400/25"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10">
            <button
              onClick={goNext}
              className="p-3 bg-gray-800/80 backdrop-blur-sm rounded-full border border-lime-400/30 
                         text-lime-400 hover:bg-lime-400 hover:text-gray-900 transition-all duration-300 
                         shadow-lg hover:shadow-lime-400/25"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Swiper Carousel - Fixed container height */}
          <div className="max-w-4xl mx-auto">
            <Swiper
              spaceBetween={30}
              slidesPerView={1.2}
              loop={true}
              centeredSlides={true}
              autoplay={isPlaying ? {
                delay: 4000,
                disableOnInteraction: false,
              } : false}
              navigation={false}
              effect="coverflow"
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: true,
              }}
              modules={[Autoplay, Navigation, EffectCoverflow]}
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              breakpoints={{
                640: {
                  slidesPerView: 1.2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 1.5,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 1.8,
                  spaceBetween: 40,
                },
              }}
              style={{
                padding: "40px 0" // Add padding to prevent cropping
              }}
            >
              {screenshots.map((screenshot, idx) => (
                <SwiperSlide key={idx}>
                  {({ isActive }) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: isActive ? 1 : 0.7, 
                        scale: isActive ? 1 : 0.85,
                        y: isActive ? 0 : 10
                      }}
                      transition={{ duration: 0.5 }}
                      className="relative group"
                    >
                      <div className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
                        isActive 
                          ? 'ring-4 ring-lime-400/50 shadow-lime-400/20' 
                          : 'ring-2 ring-gray-600/50'
                      }`}>
                        {/* Fixed image container */}
                        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-900/50">
                          <img
                            src={screenshot.src}
                            alt={screenshot.title}
                            className="max-w-full max-h-full object-contain w-auto h-auto"
                            style={{ 
                              width: 'auto', 
                              height: 'auto',
                              maxHeight: '400px'
                            }}
                          />
                        </div>
                        
                        {/* Overlay with info */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent 
                                      opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6`}>
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {screenshot.title}
                            </h3>
                            <p className="text-gray-300 text-sm">
                              {screenshot.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Controls and Indicators */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            {/* Play/Pause Button */}
            <button
              onClick={toggleAutoplay}
              className="p-3 bg-gray-800/80 backdrop-blur-sm rounded-full border border-lime-400/30 
                         text-lime-400 hover:bg-lime-400 hover:text-gray-900 transition-all duration-300"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Slide Indicators */}
            <div className="flex space-x-2">
              {screenshots.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => swiperInstance?.slideToLoop(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeIndex === idx 
                      ? 'bg-lime-400 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Active Slide Info */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6"
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              {screenshots[activeIndex]?.title}
            </h3>
            <p className="text-gray-300 max-w-md mx-auto">
              {screenshots[activeIndex]?.description}
            </p>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <div className="text-center p-6 bg-gray-800/40 rounded-2xl border border-gray-700/50">
            <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-lime-400 text-lg">⚡</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Real-time Calculations</h4>
            <p className="text-gray-400 text-sm">Instant results with live updates</p>
          </div>

          <div className="text-center p-6 bg-gray-800/40 rounded-2xl border border-gray-700/50">
            <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-lime-400 text-lg">🎯</span>
            </div>
            <h4 className="font-semibold text-white mb-2">AI-Powered Insights</h4>
            <p className="text-gray-400 text-sm">Smart tax optimization suggestions</p>
          </div>

          <div className="text-center p-6 bg-gray-800/40 rounded-2xl border border-gray-700/50">
            <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-lime-400 text-lg">📊</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Professional Reports</h4>
            <p className="text-gray-400 text-sm">Exportable tax computation reports</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}