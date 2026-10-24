"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlides } from "@/src/data/heroSlides";
import { SparkleIcon } from "@/src/components/ui/Icons";

const AUTOPLAY_MS = 6000;

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % heroSlides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      aria-label="Featured collections"
      className="relative isolate overflow-hidden bg-[#f6f1ec]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="hero-wave-bright" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e0243f" />
              <stop offset="100%" stopColor="#a30d24" />
            </linearGradient>
            <linearGradient id="hero-wave-dark" x1="0" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="#5c0413" />
              <stop offset="55%" stopColor="#8a0a1f" />
              <stop offset="100%" stopColor="#b2102a" />
            </linearGradient>
            <radialGradient id="hero-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#ff5a6e" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ff5a6e" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx="1180" cy="140" rx="360" ry="280" fill="url(#hero-glow)" />

          <path
            d="M1440 0H700C620 45 580 120 610 190C640 260 740 290 720 360C700 430 610 465 570 530C548 565 565 588 600 600H1440V0Z"
            fill="url(#hero-wave-bright)"
          />
          <path
            d="M1440 0H880C800 50 760 125 790 195C820 265 920 295 900 365C880 435 790 470 750 535C728 568 745 588 780 600H1440V0Z"
            fill="url(#hero-wave-dark)"
            opacity="0.94"
          />
          <path
            d="M700 0C620 45 580 120 610 190C640 260 740 290 720 360C700 430 610 465 570 530C548 565 565 588 600 600"
            stroke="#ffd9de"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          <path
            d="M880 0C800 50 760 125 790 195C820 265 920 295 900 365C880 435 790 470 750 535C728 568 745 588 780 600"
            stroke="#ffffff"
            strokeOpacity="0.12"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="relative h-[480px] sm:h-[540px] lg:h-[600px]">
          {heroSlides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={slide.id}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
                }`}
              >
                <div className="mx-auto h-full w-full max-w-[1240px] px-4 sm:px-6">
                  <div className="relative h-full">
                    <div className="absolute bottom-0 left-0 h-[78%] w-[58%] sm:h-[82%] sm:w-[52%] lg:left-[1%] lg:h-[94%] lg:w-[48%]">
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 640px) 60vw, (max-width: 1024px) 52vw, 600px"
                        className="object-contain object-bottom mix-blend-multiply"
                        style={{
                          maskImage:
                            "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 7%, black 100%)",
                          maskComposite: "intersect",
                        }}
                      />
                    </div>

                    <div className="absolute right-0 top-[13%] z-20 w-[50%] text-right sm:top-[15%] sm:w-[48%] lg:right-2 lg:top-1/2 lg:w-[45%] lg:-translate-y-1/2">
                      <p className="-mb-1 font-script text-[26px] leading-none text-white sm:text-[38px] lg:-mb-2 lg:text-[54px]">
                        {slide.script}
                      </p>
                      <h2 className="font-display text-[38px] font-black leading-[0.86] tracking-[0.01em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.18)] sm:text-[62px] lg:text-[92px]">
                        {slide.title}
                      </h2>
                      <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.4em] text-white/85 sm:text-[11px] lg:mt-5 lg:text-sm lg:tracking-[0.5em]">
                        {slide.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pointer-events-none absolute left-4 top-5 z-30 sm:left-6 sm:top-7 lg:left-8 lg:top-9">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink/80 shadow-sm backdrop-blur-sm sm:text-[10px]">
              <SparkleIcon className="h-3 w-3 text-brand" />
              Quality is Affordable
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Hero slides"
            className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2"
          >
            {heroSlides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-7 bg-white"
                      : "w-1.5 bg-white/55 hover:bg-white/80"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
