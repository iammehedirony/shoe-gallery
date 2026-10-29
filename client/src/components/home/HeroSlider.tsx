"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useBanners } from "@/src/hooks/queries/useBanners";

const AUTOPLAY_MS = 6000;

export default function HeroSlider() {
  const { data: slides = [], isLoading } = useBanners("HERO");
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (paused || slides.length === 0) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    // Ignore if clicking on indicator buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchStartX(clientX);
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartX === null) return;
    const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = touchStartX - clientX;
    const threshold = 50;

    if (diff > threshold) {
      // Swipe Left -> Next slide
      setActiveIndex((index) => (index + 1) % slides.length);
    } else if (diff < -threshold) {
      // Swipe Right -> Previous slide
      setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
    }

    setTouchStartX(null);
    setPaused(false);
  };

  if (isLoading) {
    return (
      <section aria-label="Featured collections" className="relative isolate overflow-hidden w-full bg-gray-100">
        <div className="relative w-full h-[260px] sm:h-[400px] lg:h-[520px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-8 h-2 bg-gray-300 rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Featured collections"
      className="relative isolate overflow-hidden w-full bg-gray-100 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        if (touchStartX !== null) setTouchStartX(null);
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
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
                className="object-cover w-full h-full pointer-events-none"
              />
            </div>
          );
        })}

        {slides.length > 1 && (
          <div
            role="tablist"
            aria-label="Hero slides"
            className="absolute bottom-4 left-1/2 z-50 pointer-events-auto flex -translate-x-1/2 items-center gap-2"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
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
