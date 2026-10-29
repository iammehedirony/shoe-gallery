"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSidebarStore } from "@/src/store/sidebarStore";
import { useAuthStore } from "@/src/store/authStore";
import { useCategories } from "@/src/hooks/queries/useCategories";
import { SiteLogo } from "@/src/components/ui/SiteLogo";
import { CloseIcon, ChevronDownIcon, UserIcon, FacebookIcon, InstagramIcon, EmailIcon, PhoneIcon } from "@/src/components/ui/Icons";

export default function MobileSidebar() {
  const { isOpen, closeSidebar } = useSidebarStore();
  const { user, isAuthenticated } = useAuthStore();
  const { data: categories = [] } = useCategories();
  const [openSubCategories, setOpenSubCategories] = useState<Record<string, boolean>>({});

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleSubCategory = (catId: string) => {
    setOpenSubCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  return (
    <div
      className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sliding Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 flex w-[85vw] max-w-[320px] h-[100dvh] flex-col bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header: Logo + Close */}
        <div className="flex items-center justify-between border-b border-black/[0.08] px-6 py-4 bg-white shrink-0">
          <Link href="/" aria-label="JH Shoe Gallery home" onClick={closeSidebar} className="shrink-0">
            <SiteLogo />
          </Link>
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close menu"
            className="grid h-8 w-8 place-items-center rounded-full text-ink/75 transition-colors hover:bg-gray-100 hover:text-brand"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Middle Scrollable Categories Section */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1 bg-white">
          <Link
            href="/"
            onClick={closeSidebar}
            className="flex items-center py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink/85 transition-colors hover:text-brand border-b border-black/[0.05]"
          >
            Home
          </Link>

          {categories.map((cat: any) => {
            const hasChildren = cat.children && cat.children.length > 0;
            const isSubOpen = openSubCategories[cat.id];
            return (
              <div key={cat.id} className="border-b border-black/[0.05]">
                <div className="flex items-center justify-between py-3">
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={closeSidebar}
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
                        className={`h-4 w-4 transition-transform duration-200 ${isSubOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isSubOpen ? "max-h-96 pb-3" : "max-h-0"
                    }`}
                  >
                    <div className="pl-4 space-y-2 border-l border-brand/20 ml-1">
                      {cat.children.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/category/${cat.slug}/${sub.slug}`}
                          onClick={closeSidebar}
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
            onClick={closeSidebar}
            className="flex items-center py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink/85 transition-colors hover:text-brand border-b border-black/[0.05]"
          >
            Shop
          </Link>
        </div>

        {/* Bottom Section (Fixed at bottom, no scroll needed): Login & Social Icons */}
        <div className="border-t border-black/[0.08] px-6 py-4 bg-white shrink-0 space-y-3">
          {isAuthenticated ? (
            <Link
              href="/account"
              onClick={closeSidebar}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-white border border-black/10 py-3 text-xs font-bold uppercase tracking-[0.16em] text-ink shadow-sm transition-colors hover:border-brand hover:text-brand"
            >
              <UserIcon className="h-4 w-4" />
              {user?.name || 'My Account'}
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={closeSidebar}
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
  );
}
