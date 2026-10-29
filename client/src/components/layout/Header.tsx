"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { productService } from "@/src/lib/services/product.service";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon, ChevronDownIcon, FacebookIcon, InstagramIcon, EmailIcon, PhoneIcon } from "@/src/components/ui/Icons";
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
  const [openSubCategories, setOpenSubCategories] = useState<Record<string, boolean>>({});
  const { data: categories = [], isLoading } = useCategories();
  const { user, isAuthenticated } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.length;
  const openSearch = useSearchStore((state) => state.openSearch);

  const closeMobile = () => setMobileOpen(false);

  const toggleSubCategory = (catId: string) => {
    setOpenSubCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

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

      {/* Mobile Sidebar Drawer (Fixed, Solid White, Slides from Left) */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm"
          onClick={closeMobile}
          aria-hidden="true"
        />

        {/* Drawer Panel */}
        <div
          className={`fixed inset-y-0 left-0 flex w-[85vw] max-w-[320px] h-screen flex-col bg-white shadow-2xl z-[100] transition-transform duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Header: Logo + Close */}
          <div className="flex items-center justify-between border-b border-black/[0.08] px-6 py-5 bg-white shrink-0">
            <Link href="/" aria-label="JH Shoe Gallery home" onClick={closeMobile} className="shrink-0">
              <SiteLogo />
            </Link>
            <button
              type="button"
              onClick={closeMobile}
              aria-label="Close menu"
              className="grid h-8 w-8 place-items-center rounded-full text-ink/75 transition-colors hover:bg-gray-100 hover:text-brand"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1 bg-white">
            <Link
              href="/"
              onClick={closeMobile}
              className="flex items-center py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink/85 transition-colors hover:text-brand border-b border-black/[0.05]"
            >
              Home
            </Link>

            {categories.map((cat: any) => {
              const hasChildren = cat.children && cat.children.length > 0;
              const isOpen = openSubCategories[cat.id];
              return (
                <div key={cat.id} className="border-b border-black/[0.05]">
                  <div className="flex items-center justify-between py-3">
                    <Link
                      href={`/category/${cat.slug}`}
                      onClick={closeMobile}
                      className="text-xs font-bold uppercase tracking-[0.18em] text-ink/85 transition-colors hover:text-brand"
                    >
                      {cat.name}
                    </Link>
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() => toggleSubCategory(cat.id)}
                        aria-label={`Toggle ${cat.name} subcategories`}
                        className="p-1 text-ink/60 transition-colors hover:text-brand"
                      >
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {hasChildren && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-96 pb-3" : "max-h-0"
                      }`}
                    >
                      <div className="pl-4 space-y-2 border-l border-brand/20 ml-1">
                        {cat.children.map((sub: any) => (
                          <Link
                            key={sub.id}
                            href={`/category/${cat.slug}/${sub.slug}`}
                            onClick={closeMobile}
                            className="block py-1 text-xs font-medium text-ink/65 transition-colors hover:text-brand"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/shop"
              onClick={closeMobile}
              className="flex items-center py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink/85 transition-colors hover:text-brand border-b border-black/[0.05]"
            >
              Shop
            </Link>
          </div>

          {/* Bottom Section: Login / Account & Social Icons */}
          <div className="border-t border-black/[0.08] px-6 py-5 bg-white shrink-0 space-y-4">
            {isAuthenticated ? (
              <Link
                href="/account"
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-white border border-black/10 py-3 text-xs font-bold uppercase tracking-[0.16em] text-ink shadow-sm transition-colors hover:border-brand hover:text-brand"
              >
                <UserIcon className="h-4 w-4" />
                {user?.name || 'My Account'}
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-white border border-black/10 py-3 text-xs font-bold uppercase tracking-[0.16em] text-ink shadow-sm transition-colors hover:border-brand hover:text-brand"
              >
                <UserIcon className="h-4 w-4" />
                Login
              </Link>
            )}

            <div className="flex items-center justify-around pt-1 text-ink/70">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 transition-colors hover:text-brand"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 transition-colors hover:text-brand"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@jhshoegallery.com"
                aria-label="Email"
                className="p-2 transition-colors hover:text-brand"
              >
                <EmailIcon className="h-5 w-5" />
              </a>
              <a
                href="tel:+8801700000000"
                aria-label="Phone"
                className="p-2 transition-colors hover:text-brand"
              >
                <PhoneIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
