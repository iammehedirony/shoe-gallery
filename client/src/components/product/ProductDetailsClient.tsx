"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/src/lib/format";

export default function ProductDetailsClient({ product }: { product: any }) {
  const [mainImage, setMainImage] = useState(product.images?.[0] || product.image || "");
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "additional" | "reviews">("description");

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Image Gallery */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            {(product.images || [product.image]).map((img: string, i: number) => (
              <button key={i} onClick={() => setMainImage(img)} className="h-20 w-20 overflow-hidden rounded border border-black/10">
                <Image src={img} alt="Thumbnail" width={80} height={80} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="relative aspect-square flex-1 overflow-hidden rounded-lg bg-[#f5f1ee]">
            <Image src={mainImage} alt={product.title} fill className="object-cover" />
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <p className="text-sm text-muted">Men / {product.categories?.[1] || "Collection"}</p>
          <h1 className="text-3xl font-bold text-ink">{product.title}</h1>
          <div className="mt-4 flex items-baseline gap-4">
            <span className="text-2xl font-bold text-brand">{formatPrice(product.price)}</span>
            <span className="text-lg font-medium text-muted line-through">{formatPrice(product.oldPrice)}</span>
          </div>

          <button onClick={() => setIsSizeChartOpen(true)} className="mt-4 w-fit text-sm font-semibold text-brand underline">SIZE CHART 📐</button>

          {/* Size Chart Modal */}
          {isSizeChartOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="rounded-lg bg-white p-8">
                <h2 className="text-xl font-bold">Size Chart</h2>
                <p className="mt-4">Size chart content goes here...</p>
                <button onClick={() => setIsSizeChartOpen(false)} className="mt-4 rounded bg-ink px-4 py-2 text-white">Close</button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="font-semibold text-ink">Select Size</h2>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {product.sizes?.map((size: string) => (
                <button key={size} className="rounded border border-black/10 py-2 text-sm text-ink transition-colors hover:border-brand hover:text-brand">
                  Size/{size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="mt-8 flex gap-4">
            <div className="flex items-center rounded border border-black/20">
              <button onClick={handleDecrement} className="px-4 py-2 text-xl">-</button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button onClick={handleIncrement} className="px-4 py-2 text-xl">+</button>
            </div>
            <button className="flex-1 rounded bg-ink px-8 py-3 font-semibold text-white">ADD TO CART</button>
          </div>
          <button className="mt-4 w-full rounded bg-brand px-8 py-3 font-semibold text-white">BUY NOW</button>
          
          {/* Product Note */}
          <p className="mt-4 text-sm text-ink/80">
            সারাদেশে ২-৫ দিনে হোম-ডেলিভারি। একসাথে যত খুশি পণ্য অর্ডার করুন, ডেলিভারি চার্জ একই থাকবে। প্রয়োজনে কল করুন: 01324250470
          </p>
        </div>
      </div>
      
      {/* Description Tabs */}
      <div className="mt-12 border-t border-black/10 pt-8">
        <div className="flex gap-8 border-b border-black/10 pb-4 text-sm font-semibold uppercase">
          {["description", "additional", "reviews"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={activeTab === tab ? "text-brand" : "text-ink"}>
              {tab === "reviews" ? "Reviews (0)" : tab.replace("-", " ")}
            </button>
          ))}
        </div>
        <div className="mt-4 text-muted">
          {activeTab === "description" && <p>{product.description}</p>}
          {activeTab === "additional" && <p>Additional info...</p>}
          {activeTab === "reviews" && <p>No reviews yet.</p>}
        </div>
      </div>
    </main>
  );
}