"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cmsService, Banner } from "@/src/lib/services/cms.service";
import { ChevronRightIcon } from "@/src/components/ui/Icons";

export default function PromoBannerGrid() {
  const [subBanners, setSubBanners] = useState<Banner[]>([]);

  useEffect(() => {
    async function fetchSubBanners() {
      try {
        const data = await cmsService.getBanners("SUB_BANNER");
        setSubBanners(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load sub banners", err);
      }
    }
    fetchSubBanners();
  }, []);

  return (
    <section aria-label="Current promotions" className="bg-white">
      <div className="mx-auto grid w-full max-w-[1240px] gap-4 px-4 py-6 sm:grid-cols-3 sm:gap-5 lg:px-6 lg:py-8">
        {subBanners.length > 0 ? (
          subBanners.map((banner, idx) => (
            <a
              key={banner.id}
              href={banner.link || "#"}
              className={`group relative flex min-h-[170px] overflow-hidden rounded-xl p-5 text-white ${
                idx === 0
                  ? "bg-gradient-to-br from-[#9c0b22] via-[#c8102e] to-[#e0243f] shadow-[0_10px_30px_-18px_rgba(200,16,46,0.9)]"
                  : idx === 1
                  ? "bg-[#140f12]"
                  : "bg-[#ffecec] text-ink"
              }`}
            >
              <Image
                src={banner.image}
                alt={banner.alt || banner.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover object-right opacity-40 mix-blend-luminosity transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

              <div className="relative z-10 flex flex-col justify-center">
                <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/75">
                  {banner.script || "Featured"}
                </span>
                <p className="font-display text-3xl font-black leading-none sm:text-[38px]">
                  {banner.title}
                </p>
                {banner.tagline && (
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-white/85">
                    {banner.tagline}
                  </p>
                )}
                <span className="mt-3 inline-flex w-fit items-center gap-0.5 border-b border-white/50 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]">
                  Explore Now
                  <ChevronRightIcon className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))
        ) : (
          <>
            <div className="bg-[#f9f9f9] p-5 rounded-xl border border-black/5 flex items-center justify-center text-ink/50 text-xs font-medium">
              Sub Banner 1 (Upload in CMS)
            </div>
            <div className="bg-[#f9f9f9] p-5 rounded-xl border border-black/5 flex items-center justify-center text-ink/50 text-xs font-medium">
              Sub Banner 2 (Upload in CMS)
            </div>
            <div className="bg-[#f9f9f9] p-5 rounded-xl border border-black/5 flex items-center justify-center text-ink/50 text-xs font-medium">
              Sub Banner 3 (Upload in CMS)
            </div>
          </>
        )}
      </div>
    </section>
  );
}
