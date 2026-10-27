"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSearchStore } from "@/src/store/searchStore";
import { productService } from "@/src/lib/services/product.service";
import { formatPrice } from "@/src/lib/format";
import { SearchIcon, CloseIcon } from "@/src/components/ui/Icons";

export default function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, closeSearch } = useSearchStore();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSearch();
      }
    };
    if (isSearchOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen, closeSearch]);

  const { data: searchResult, isLoading } = useQuery({
    queryKey: ["live-search", debouncedQuery],
    queryFn: () => productService.getProducts({ search: debouncedQuery, limit: 8 }),
    enabled: isSearchOpen && debouncedQuery.trim().length > 0,
  });

  if (!isSearchOpen) return null;

  const products = searchResult?.products || searchResult?.data?.products || searchResult || [];

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
    closeSearch();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center px-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={closeSearch}
    >
      <div
        className="relative w-full max-w-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pill Search Bar */}
        <div className="bg-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-4 border border-black/10">
          <SearchIcon className="h-6 w-6 text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-xl font-medium outline-none text-ink placeholder:text-muted/60"
          />
          <button
            onClick={closeSearch}
            className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-ink/70 hover:bg-gray-200 hover:text-ink transition flex-shrink-0"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Results Dropdown */}
        {debouncedQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-3 bg-white rounded-2xl shadow-2xl border border-black/10 overflow-hidden max-h-[65vh] overflow-y-auto divide-y divide-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-2"></div>
                <p className="text-sm text-muted">Searching products...</p>
              </div>
            ) : Array.isArray(products) && products.length > 0 ? (
              <div className="p-3 space-y-2">
                {products.map((product: any) => (
                  <div
                    key={product.id || product._id}
                    onClick={() => handleProductClick(product.id || product._id)}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative h-16 w-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-black/5 shadow-xs">
                        <Image
                          src={product.image || "/images/placeholder.jpg"}
                          alt={product.title}
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-ink text-base truncate group-hover:text-brand transition-colors">
                          {product.title}
                        </h4>
                        {product.category && (
                          <p className="text-xs text-muted uppercase tracking-wider mt-0.5">{product.category.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {product.oldPrice && Number(product.oldPrice) > Number(product.price) && (
                        <span className="text-xs text-muted line-through mr-2">{formatPrice(Number(product.oldPrice))}</span>
                      )}
                      <span className="font-bold text-brand text-base">{formatPrice(Number(product.price))}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-base font-semibold text-ink mb-1">No products found</p>
                <p className="text-xs text-muted">Try searching with a different keyword</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
