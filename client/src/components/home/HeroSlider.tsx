"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cmsService, Banner } from "@/src/lib/services/cms.service";
import { heroSlides as fallbackSlides } from "@/src/data/heroSlides";

const AUTOPLAY_MS = 6000;

export default function HeroSlider() {
  const [slides, setSlides] = useState<Banner[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    async function fetchHeroBanners() {
      try {
        const data = await cmsService.getBanners("HERO");
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        } else {
          setSlides(fallbackSlides as any);
        }
      } catch (err) {
        console.error("Failed to load hero banners", err);
        setSlides(fallbackSlides as any);
      }
    }
    fetchHeroBanners();
  }, []);

  useEffect(() => {
    if (paused || slides.length === 0) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      aria-label="Featured collections"
      className="relative isolate overflow-hidden w-full bg-gray-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative w-full h-[260px] sm:h-[400px] lg:h-[520px]">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={slide.id || index}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.alt || slide.title || "Banner"}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover w-full h-full"
              />
              {slide.title && slide.script && (
                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center p-4">
                  {slide.script && <span className="text-xs sm:text-sm uppercase tracking-widest mb-1 font-semibold">{slide.script}</span>}
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black">{slide.title}</h2>
                  {slide.tagline && <p className="text-xs sm:text-sm mt-2 tracking-wider">{slide.tagline}</p>}
                </div>
              )}
            </div>
          );
        })}

        {slides.length > 1 && (
          <div
            role="tablist"
            aria-label="Hero slides"
            className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2"
          >
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={slide.id || index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-8 bg-white"
                      : "w-2 bg-white/60 hover:bg-white"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
