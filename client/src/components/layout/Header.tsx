"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { productService } from "@/src/lib/services/product.service";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon, ChevronDownIcon } from "@/src/components/ui/Icons";
import { useAuthStore } from "@/src/store/authStore";
import { useCartStore } from "@/src/store/cartStore";
import { useSearchStore } from "@/src/store/searchStore";
import { useCategories } from "@/src/hooks/queries/useCategories";
import Image from "next/image";

export function SiteLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <Image src="/logo.png" alt="JH Shoe Gallery Logo" width={100} height={35} className="h-auto w-auto" />
    </span>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const { data: categories = [], isLoading } = useCategories();
  const { user, isAuthenticated } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.length;
  const openSearch = useSearchStore((state) => state.openSearch);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:h-20 lg:px-6">
        <Link href="/" aria-label="JH Shoe Gallery home" onClick={closeMobile} className="shrink-0">
          <SiteLogo />
        </Link>

        {isLoading ? (
          <nav aria-label="Main navigation loading" className="hidden items-center gap-7 lg:flex">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
          </nav>
        ) : (
          <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
            <Link
              href="/"
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/75 transition-colors hover:text-brand"
            >
              Home
            </Link>
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className="relative py-2"
                onMouseEnter={() => setHoveredMenu(cat.name)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/75 transition-colors hover:text-brand"
                >
                  {cat.name}
                  {cat.children && cat.children.length > 0 && <ChevronDownIcon className="h-3 w-3" />}
                </Link>
                {cat.children && cat.children.length > 0 && hoveredMenu === cat.name && (
                  <div className="absolute left-0 top-full w-52 rounded-lg bg-white p-2 shadow-lg border border-black/5 z-50">
                    {cat.children.map((sub: any) => (
                      <Link
                        key={sub.id}
                        href={`/category/${cat.slug}/${sub.slug}`}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-ink/70 hover:bg-gray-50 hover:text-brand rounded"
                      >
                        <span className="w-2 h-2 bg-brand/40 rounded-full"></span>
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/shop"
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/75 transition-colors hover:text-brand"
            >
              Shop
            </Link>
          </nav>
        )}

        {isLoading ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
            <div className="hidden sm:block h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search products"
              className="grid h-9 w-9 place-items-center rounded-full text-ink/80 transition-colors hover:bg-blush hover:text-brand"
            >
              <SearchIcon className="h-[18px] w-[18px]" />
            </button>

            <Link
              href={isAuthenticated ? "/account" : "/login"}
              aria-label="My account"
              className="hidden h-9 w-9 place-items-center rounded-full text-ink/80 transition-colors hover:bg-blush hover:text-brand sm:grid"
            >
              <UserIcon className="h-[18px] w-[18px]" />
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart, ${cartCount} items`}
              className="relative grid h-9 w-9 place-items-center rounded-full text-ink/80 transition-colors hover:bg-blush hover:text-brand"
            >
              <BagIcon className="h-[18px] w-[18px]" />
              <span className="pointer-events-none absolute -right-0.5 -top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-brand px-1 text-[9px] font-bold leading-none text-white">
                {cartCount}
              </span>
            </Link>

            {isAuthenticated ? (
              <Link
                href="/account"
                className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/80 transition-colors hover:text-brand sm:block"
              >
                {user?.name?.split(' ')[0] || 'Account'}
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/80 transition-colors hover:text-brand sm:block"
              >
                Log In
              </Link>
            )}

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
        )}
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-black/[0.06] bg-white transition-[max-height] duration-300 lg:hidden ${
          mobileOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="mx-auto flex max-w-[1240px] flex-col px-4 py-3 overflow-y-auto max-h-[450px]">
          <Link
            href="/"
            onClick={closeMobile}
            className="border-b border-black/[0.05] py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/75"
          >
            Home
          </Link>
          {categories.map((cat: any) => (
            <div key={cat.id} className="border-b border-black/[0.05] py-2">
              <Link
                href={`/category/${cat.slug}`}
                onClick={closeMobile}
                className="block text-xs font-semibold uppercase tracking-[0.18em] text-ink/75 py-1"
              >
                {cat.name}
              </Link>
              {cat.children && cat.children.length > 0 && (
                <div className="pl-4 py-1 space-y-1">
                  {cat.children.map((sub: any) => (
                    <Link
                      key={sub.id}
                      href={`/category/${cat.slug}/${sub.slug}`}
                      onClick={closeMobile}
                      className="block text-xs text-ink/60 py-1 hover:text-brand"
                    >
                      - {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/shop"
            onClick={closeMobile}
            className="border-b border-black/[0.05] py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/75"
          >
            Shop
          </Link>
          {isAuthenticated ? (
            <Link
              href="/account"
              onClick={closeMobile}
              className="py-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand"
            >
              My Account
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={closeMobile}
              className="py-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand"
            >
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
