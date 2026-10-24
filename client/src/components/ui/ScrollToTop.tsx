"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@/src/components/ui/Icons";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 right-4 z-40 grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-ink shadow-[0_10px_30px_-12px_rgba(17,17,17,0.45)] transition-all duration-300 hover:border-brand hover:text-brand sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUpIcon className="h-4 w-4" />
    </button>
  );
}
