"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/src/lib/format";
import type { Product } from "@/src/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Support both id and _id, and slug as fallback
  const productUrl = `/product/${product.id || product._id || product.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-black/[0.07] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgba(17,17,17,0.45)]">
      <Link href={productUrl} className="relative aspect-square overflow-hidden bg-[#f5f1ee]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 290px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {product.discount > 0 && (
          <span className="absolute left-2 top-2 rounded-sm bg-brand px-1.5 py-1 text-[9px] font-bold leading-none tracking-[0.04em] text-white shadow-sm">
            {product.discount}% OFF
          </span>
        )}

        {product.badge ? (
          <span className="absolute right-2 top-2 rounded-sm bg-ink/85 px-1.5 py-1 text-[8px] font-semibold uppercase leading-none tracking-[0.08em] text-white backdrop-blur-sm">
            {product.badge}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <div className="flex flex-wrap gap-1" role="group" aria-label={`Available sizes for ${product.title}`}>
          {product.sizes?.map((size) => {
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(isSelected ? null : size);
                }}
                aria-pressed={isSelected}
                aria-label={`Select size ${size}`}
                className={`rounded-[3px] border px-1.5 py-0.5 text-[9px] leading-4 transition-colors sm:text-[10px] ${
                  isSelected
                    ? "border-brand bg-brand font-semibold text-white"
                    : "border-black/10 bg-white text-muted hover:border-brand/50 hover:text-brand"
                }`}
              >
                Size/{size}
              </button>
            );
          })}
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-10 text-[12px] font-medium leading-5 text-ink/90 transition-colors group-hover:text-brand sm:text-[13px]">
          <Link href={productUrl} className="hover:underline">
            {product.title}
          </Link>
        </h3>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2">
          <span className="text-[11px] font-medium text-muted line-through">
            {formatPrice(product.oldPrice)}
          </span>
          <span className="text-[13px] font-bold text-brand sm:text-sm">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </article>
  );
}
