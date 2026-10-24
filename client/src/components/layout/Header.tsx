"use client";

import Link from "next/link";
import { useState } from "react";
import { navLinks } from "@/src/data/navigation";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "@/src/components/ui/Icons";

const CART_COUNT = 0;

export function SiteLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <span className="-skew-x-12 font-logo text-[24px] leading-none tracking-[-0.05em] text-brand sm:text-[28px]">
        RICHKID
      </span>
      <span aria-hidden="true" className="ml-1 flex flex-col gap-[3px]">
        <span className="block h-[3px] w-3 -skew-x-12 rounded-full bg-brand" />
        <span className="block h-[3px] w-2 -skew-x-12 rounded-full bg-brand" />
        <span className="block h-[3px] w-1 -skew-x-12 rounded-full bg-brand" />
      </span>
    </span>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:h-20 lg:px-6">
        <Link href="/" aria-label="RICHKID home" onClick={closeMobile} className="shrink-0">
          <SiteLogo />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:text-brand ${
                link.active ? "text-brand" : "text-ink/75"
              }`}
            >
              {link.label}
              {link.active ? (
                <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-[2px] w-4 rounded-full bg-brand" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Search products"
            className="grid h-9 w-9 place-items-center rounded-full text-ink/80 transition-colors hover:bg-blush hover:text-brand"
          >
            <SearchIcon className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            aria-label="My account"
            className="hidden h-9 w-9 place-items-center rounded-full text-ink/80 transition-colors hover:bg-blush hover:text-brand sm:grid"
          >
            <UserIcon className="h-[18px] w-[18px]" />
          </button>

          <a
            href="#"
            aria-label={`Cart, ${CART_COUNT} items`}
            className="relative grid h-9 w-9 place-items-center rounded-full text-ink/80 transition-colors hover:bg-blush hover:text-brand"
          >
            <BagIcon className="h-[18px] w-[18px]" />
            <span className="pointer-events-none absolute -right-0.5 -top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-brand px-1 text-[9px] font-bold leading-none text-white">
              {CART_COUNT}
            </span>
          </a>

          <a
            href="#"
            className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/80 transition-colors hover:text-brand sm:block"
          >
            Log In
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="grid h-9 w-9 place-items-center rounded-full text-ink/80 transition-colors hover:bg-blush hover:text-brand lg:hidden"
          >
            {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-black/[0.06] bg-white transition-[max-height] duration-300 lg:hidden ${
          mobileOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="mx-auto flex max-w-[1240px] flex-col px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={closeMobile}
              className={`border-b border-black/[0.05] py-3 text-xs font-semibold uppercase tracking-[0.18em] last:border-0 ${
                link.active ? "text-brand" : "text-ink/75"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a href="#" className="py-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Log In
          </a>
        </nav>
      </div>
    </header>
  );
}
