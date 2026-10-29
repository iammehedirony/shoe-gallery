"use client";

import Link from "next/link";
import { useState } from "react";
import { BagIcon, MenuIcon, SearchIcon, UserIcon, ChevronDownIcon } from "@/src/components/ui/Icons";
import { useAuthStore } from "@/src/store/authStore";
import { useCartStore } from "@/src/store/cartStore";
import { useSearchStore } from "@/src/store/searchStore";
import { useSidebarStore } from "@/src/store/sidebarStore";
import { useCategories } from "@/src/hooks/queries/useCategories";
import { SiteLogo } from "@/src/components/ui/SiteLogo";

export default function Header() {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const { data: categories = [], isLoading } = useCategories();
  const { user, isAuthenticated } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.length;
  const openSearch = useSearchStore((state) => state.openSearch);
  const openSidebar = useSidebarStore((state) => state.openSidebar);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:h-20 lg:px-6">
        <Link href="/" aria-label="JH Shoe Gallery home" className="shrink-0">
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
              onClick={openSidebar}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-full text-ink/80 transition-colors hover:bg-blush hover:text-brand lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
