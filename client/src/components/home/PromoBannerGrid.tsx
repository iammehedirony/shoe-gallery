import Image from "next/image";
import { ChevronRightIcon, GiftIcon } from "@/src/components/ui/Icons";

export default function PromoBannerGrid() {
  return (
    <section aria-label="Current promotions" className="bg-white">
      <div className="mx-auto grid w-full max-w-[1240px] gap-4 px-4 py-6 sm:grid-cols-3 sm:gap-5 lg:px-6 lg:py-8">
        <a
          href="#new-arrival"
          className="group relative flex min-h-[170px] overflow-hidden rounded-xl bg-gradient-to-br from-[#9c0b22] via-[#c8102e] to-[#e0243f] p-5 text-white shadow-[0_10px_30px_-18px_rgba(200,16,46,0.9)]"
        >
          <Image
            src="/images/products/01.jpg"
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover object-right opacity-30 mix-blend-luminosity transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#9c0b22] via-[#c8102e]/80 to-transparent" />

          <div className="relative z-10 flex flex-col justify-center">
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/75">
              Flat
            </span>
            <p className="font-display text-4xl font-black leading-none sm:text-[44px]">
              99 <span className="font-script text-3xl font-normal sm:text-4xl">Deals</span>
            </p>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-white/85">
              On selected styles
            </p>
            <span className="mt-3 inline-flex w-fit items-center gap-0.5 border-b border-white/50 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]">
              Shop Deals
              <ChevronRightIcon className="h-3 w-3" />
            </span>
          </div>

          <GiftIcon className="absolute -bottom-2 right-4 z-10 h-16 w-16 text-white/80 sm:h-20 sm:w-20" />
        </a>

        <a
          href="#best-selling"
          className="group relative flex min-h-[170px] overflow-hidden rounded-xl bg-[#ffecec] p-5"
        >
          <div className="relative z-10 flex max-w-[58%] flex-col justify-center">
            <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-brand/70">
              Up to
            </span>
            <p className="font-display text-4xl font-black uppercase leading-none text-brand sm:text-[44px]">
              50% <span className="text-2xl">off</span>
            </p>
            <p className="mt-1.5 text-[10px] uppercase leading-4 tracking-[0.16em] text-ink/55">
              Hot picks of the week
            </p>
            <span className="mt-3 inline-flex w-fit items-center gap-0.5 border-b border-brand/40 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
              Shop Sale
              <ChevronRightIcon className="h-3 w-3" />
            </span>
          </div>

          <div className="absolute -right-3 top-1/2 h-[150px] w-[150px] -translate-y-1/2 overflow-hidden rounded-full border-[6px] border-white shadow-[0_18px_35px_-20px_rgba(200,16,46,0.7)] sm:h-[160px] sm:w-[160px]">
            <Image
              src="/images/products/07.jpg"
              alt="Colourful sneakers on sale"
              fill
              sizes="180px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <span className="absolute right-4 top-3 z-10 rotate-6 rounded bg-brand px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-md">
            Hot Sale
          </span>
        </a>

        <a
          href="#new-arrival"
          className="group relative flex min-h-[170px] overflow-hidden rounded-xl bg-[#140f12] p-5 text-white"
        >
          <Image
            src="/images/products/04.jpg"
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover object-right opacity-90 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#140f12] via-[#140f12]/85 to-transparent" />

          <div className="relative z-10 flex flex-col justify-center">
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/55">
              Just dropped
            </span>
            <p className="mt-1 font-display text-[34px] font-black uppercase leading-[0.88] sm:text-[40px]">
              New
              <br />
              <span className="text-[#ff5468]">Arrival</span>
            </p>
            <span className="mt-3 inline-flex w-fit items-center gap-0.5 border-b border-white/35 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90">
              Explore Now
              <ChevronRightIcon className="h-3 w-3" />
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
