"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBanners } from "@/src/hooks/queries/useBanners";
import { CloseIcon } from "@/src/components/ui/Icons";

export default function PromoModal() {
  const { data: promoBanners = [] } = useBanners("PROMO");
  const [isVisible, setIsVisible] = useState(false); // Controls mounting
  const [isOpen, setIsOpen] = useState(false);       // Controls CSS transition (opacity/scale)
  const [timeLeft, setTimeLeft] = useState(4);

  const activePromo = promoBanners.find((b) => b.isActive) || promoBanners[0];

  useEffect(() => {
    if (!activePromo) return;

    // Check session storage
    const hasShown = sessionStorage.getItem("jh_promo_shown");
    if (hasShown) return;

    // Show after 1.2 second delay on load
    const showTimer = window.setTimeout(() => {
      setIsVisible(true); // Mount component
      sessionStorage.setItem("jh_promo_shown", "true");

      // Trigger enter transition in next frame
      requestAnimationFrame(() => {
        setIsOpen(true);
        setTimeLeft(4);
      });
    }, 1200);

    return () => window.clearTimeout(showTimer);
  }, [activePromo]);

  // Countdown timer & auto close
  useEffect(() => {
    if (!isOpen) return;

    if (timeLeft <= 0) {
      handleClose();
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, timeLeft]);

  const handleClose = () => {
    setIsOpen(false); // Trigger exit transition (opacity-0 scale-95)
    
    // Unmount after transition finishes (300ms)
    const unmountTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, 300);

    return () => window.clearTimeout(unmountTimer);
  };

  if (!isVisible) return null;

  const content = (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[550px] bg-gray-100 rounded-none overflow-hidden">
      <Image
        src={activePromo.image}
        alt={activePromo.alt || activePromo.title || "Promotional Banner"}
        fill
        className="object-cover rounded-none"
      />
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300 ease-out ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={handleClose} aria-hidden="true" />

      <div
        className={`relative w-full max-w-3xl bg-transparent rounded-none shadow-2xl overflow-hidden transition-all duration-300 ease-out transform ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Top-Right Absolute Controls: Countdown Badge + Close Button */}
        <div className="absolute right-4 top-4 z-20 flex items-center gap-3">
          {timeLeft > 0 && (
            <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white shadow-lg">
              Closing in {timeLeft}s
            </span>
          )}

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close promotional banner"
            className="grid h-10 w-10 place-items-center rounded-full bg-black/60 backdrop-blur-md text-white transition-colors hover:bg-black/90 shadow-lg cursor-pointer"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Full Image Banner (Clickable if link exists) */}
        {activePromo.link ? (
          <Link href={activePromo.link} onClick={handleClose} className="block w-full h-full rounded-none">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
