"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useBanners } from "@/src/hooks/queries/useBanners";

const AUTOPLAY_MS = 6000;

export default function HeroSlider() {
  const { data: slides = [], isLoading } = useBanners("HERO");
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length === 0) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[260px] sm:h-[400px] lg:h-[520px] bg-gray-100 flex items-center justify-center animate-pulse">
        <div className="text-gray-400 font-medium text-sm">Loading featured collection...</div>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return null;
  }

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
