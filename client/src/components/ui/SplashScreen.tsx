"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onLoadComplete?: () => void;
}

export default function SplashScreen({ onLoadComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 100);

    // Minimum splash duration: 1000ms
    const minDuration = 1000;
    const startTime = Date.now();

    // Wait for page to be ready
    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);

      // Complete progress
      setProgress(100);

      setTimeout(() => {
        setIsFadingOut(true);

        // Complete fade out animation (600ms)
        setTimeout(() => {
          setIsVisible(false);
          onLoadComplete?.();
          clearInterval(progressInterval);
        }, 600);
      }, remaining);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => {
        window.removeEventListener("load", handleLoad);
        clearInterval(progressInterval);
      };
    }
  }, [onLoadComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-all duration-600 ${
        isFadingOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with scale animation */}
        <div className={`mb-10 transition-all duration-700 ${isFadingOut ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="relative">
            <Image
              src="/logo.png"
              alt="JH Shoe Gallery"
              width={180}
              height={63}
              priority
              className="h-auto w-auto drop-shadow-sm"
            />
            {/* Shine effect */}
            <div className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent"
                 style={{ animationDuration: '2s' }}></div>
          </div>
        </div>

        {/* Modern spinner */}
        <div className="relative h-20 w-20 mb-8">
          {/* Outer decorative ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-blush opacity-40"></div>

          {/* Main spinning ring with gradient */}
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-brand border-r-brand/70"
               style={{ animationDuration: '1s' }}></div>

          {/* Secondary counter-spinning ring */}
          <div className="absolute inset-2 animate-spin rounded-full border-[2px] border-transparent border-b-brand/50 border-l-brand/30"
               style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>

          {/* Pulsing center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 animate-pulse rounded-full bg-brand shadow-lg shadow-brand/50"
                 style={{ animationDuration: '1.5s' }}></div>
          </div>
        </div>

        {/* Loading text with fade animation */}
        <div className="text-center space-y-3">
          <p className="animate-pulse text-sm font-semibold tracking-wide text-ink/70"
             style={{ animationDuration: '2s' }}>
            Loading your experience...
          </p>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand to-brand-light transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <p className={`absolute bottom-10 text-[10px] font-bold uppercase tracking-[0.25em] text-ink/20 transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}>
        Premium Shoes & Lifestyle
      </p>
    </div>
  );
}
