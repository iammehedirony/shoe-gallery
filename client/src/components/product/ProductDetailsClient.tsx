"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProductDetail } from "@/src/hooks/queries/useProducts";
import { formatPrice } from "@/src/lib/format";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/src/components/ui/Icons";

interface ProductDetailsClientProps {
  productId: string;
}

export default function ProductDetailsClient({ productId }: ProductDetailsClientProps) {
  const { data: product, isLoading, error } = useProductDetail(productId);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "additional" | "reviews">("description");

  // Loading state
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-[1240px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-[1240px]">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-ink mb-4">Product Not Found</h1>
          <p className="text-muted mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/shop" className="bg-brand text-white px-6 py-3 rounded font-semibold">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const currentImage = images[currentImageIndex];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Get available sizes from variants
  const availableSizes = product.variants?.filter((v: any) => v.stock > 0).map((v: any) => v.size) || [];
  const hasReviews = product.reviews && product.reviews.length > 0;
  const averageRating = hasReviews
    ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <main className="container mx-auto px-4 py-8 max-w-[1240px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-ink/50 mb-6">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand">Shop</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug}`} className="hover:text-brand capitalize">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-brand font-medium">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Image Gallery with Arrows */}
        <div className="flex gap-4">
          {/* Thumbnail Column */}
          <div className="flex flex-col gap-2">
            {images.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`h-20 w-20 overflow-hidden rounded border transition-all ${
                  i === currentImageIndex ? "border-brand ring-2 ring-brand/20" : "border-black/10 hover:border-brand/50"
                }`}
              >
                <Image src={img} alt={`Thumbnail ${i + 1}`} width={80} height={80} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Image with Navigation Arrows */}
          <div className="relative aspect-square flex-1 overflow-hidden rounded-lg bg-blush/30 group">
            <Image src={currentImage} alt={product.title} fill className="object-cover" priority />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-ink" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-6 h-6 text-ink" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4 bg-brand text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                {product.badge}
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          {/* Category & Tags */}
          <div className="flex items-center gap-2 mb-2">
            {product.category && (
              <Link
                href={`/category/${product.category.slug}`}
                className="text-xs font-semibold uppercase tracking-wider text-muted hover:text-brand"
              >
                {product.category.name}
              </Link>
            )}
            {product.tags && product.tags.length > 0 && (
              <>
                <span className="text-muted">•</span>
                {product.tags.slice(0, 2).map((tag: any) => (
                  <span key={tag.id} className="text-xs bg-blush text-brand px-2 py-0.5 rounded">
                    {tag.name}
                  </span>
                ))}
              </>
            )}
          </div>

          <h1 className="text-3xl font-bold text-ink mb-4">{product.title}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-2">
            <span className="text-3xl font-bold text-brand">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="text-lg font-medium text-muted line-through">{formatPrice(product.oldPrice)}</span>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                  Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Rating */}
          {hasReviews && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted">
                {averageRating.toFixed(1)} ({product.reviews.length} reviews)
              </span>
            </div>
          )}

          {/* SKU & Stock */}
          <div className="flex items-center gap-4 text-sm text-muted mb-6 pb-6 border-b border-black/10">
            <span>SKU: <span className="font-medium text-ink">{product.sku}</span></span>
            <span>•</span>
            <span className={`font-medium ${availableSizes.length > 0 ? "text-green-600" : "text-red-600"}`}>
              {availableSizes.length > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-ink">Select Size</h2>
                <button
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
                >
                  📐 SIZE CHART
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded border py-2.5 text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-brand bg-brand text-white"
                        : "border-black/15 text-ink hover:border-brand hover:text-brand"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="flex gap-3 mb-3">
            <div className="flex items-center rounded border border-black/20">
              <button
                onClick={handleDecrement}
                className="px-4 py-3 text-xl font-bold hover:bg-gray-50 transition"
              >
                −
              </button>
              <span className="px-6 font-semibold text-lg">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="px-4 py-3 text-xl font-bold hover:bg-gray-50 transition"
              >
                +
              </button>
            </div>
            <button
              disabled={availableSizes.length === 0 || !selectedSize}
              className="flex-1 rounded bg-ink px-8 py-3 font-semibold text-white hover:bg-ink/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ADD TO CART
            </button>
          </div>

          <button
            disabled={availableSizes.length === 0 || !selectedSize}
            className="w-full rounded bg-brand px-8 py-3 font-semibold text-white hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            BUY NOW
          </button>

          {/* Delivery Info */}
          <div className="mt-6 bg-blush/50 rounded-lg p-4 text-sm text-ink/80 space-y-2">
            <p className="flex items-center gap-2">
              <span className="text-lg">🚚</span>
              <span>সারাদেশে ২-৫ দিনে হোম-ডেলিভারি</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <span>একসাথে যত খুশি পণ্য অর্ডার করুন, ডেলিভারি চার্জ একই থাকবে</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-lg">📞</span>
              <span>প্রয়োজনে কল করুন: <a href="tel:01324250470" className="font-semibold text-brand hover:underline">01324250470</a></span>
            </p>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setIsSizeChartOpen(false)}>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-ink">Size Chart</h2>
              <button
                onClick={() => setIsSizeChartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-muted mb-4">
                Please refer to the size chart below to find your perfect fit. Measurements are in EU sizes.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blush/50">
                      <th className="border border-black/10 px-4 py-3 text-left font-semibold text-ink">Size (EU)</th>
                      <th className="border border-black/10 px-4 py-3 text-left font-semibold text-ink">UK</th>
                      <th className="border border-black/10 px-4 py-3 text-left font-semibold text-ink">US</th>
                      <th className="border border-black/10 px-4 py-3 text-left font-semibold text-ink">Foot Length (cm)</th>
                      <th className="border border-black/10 px-4 py-3 text-center font-semibold text-ink">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants?.map((variant: any) => {
                      const sizeNum = parseInt(variant.size);
                      const ukSize = sizeNum - 33;
                      const usSize = sizeNum - 32;
                      const footLength = 22 + (sizeNum - 38) * 0.67;

                      return (
                        <tr key={variant.id} className="hover:bg-gray-50 transition">
                          <td className="border border-black/10 px-4 py-3 font-medium">{variant.size}</td>
                          <td className="border border-black/10 px-4 py-3">{ukSize}</td>
                          <td className="border border-black/10 px-4 py-3">{usSize}</td>
                          <td className="border border-black/10 px-4 py-3">{footLength.toFixed(1)}</td>
                          <td className={`border border-black/10 px-4 py-3 text-center font-semibold ${variant.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                            {variant.stock > 0 ? `${variant.stock} available` : "Out of stock"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-ink mb-2">💡 How to measure your foot:</h3>
                <ol className="text-sm text-muted space-y-1 list-decimal list-inside">
                  <li>Place your foot on a flat surface with your heel against a wall</li>
                  <li>Mark the longest toe with a pen</li>
                  <li>Measure the distance from the wall to the mark in centimeters</li>
                  <li>Match your measurement to the chart above</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Description Tabs */}
      <div className="mt-16 border-t border-black/10 pt-8">
        <div className="flex gap-8 border-b border-black/10 pb-4">
          {[
            { key: "description", label: "Description" },
            { key: "additional", label: "Additional Info" },
            { key: "reviews", label: `Reviews (${product.reviews?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`text-sm font-semibold uppercase tracking-wide transition-colors pb-2 border-b-2 ${
                activeTab === tab.key
                  ? "text-brand border-brand"
                  : "text-muted border-transparent hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {/* Description Tab */}
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p className="text-ink/80 leading-relaxed">
                {product.description || "No description available for this product."}
              </p>
            </div>
          )}

          {/* Additional Info Tab */}
          {activeTab === "additional" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between py-3 border-b border-black/10">
                <span className="font-medium text-ink">SKU:</span>
                <span className="text-muted">{product.sku}</span>
              </div>
              {product.category && (
                <div className="flex justify-between py-3 border-b border-black/10">
                  <span className="font-medium text-ink">Category:</span>
                  <span className="text-muted">{product.category.name}</span>
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="flex justify-between py-3 border-b border-black/10">
                  <span className="font-medium text-ink">Tags:</span>
                  <span className="text-muted">{product.tags.map((t: any) => t.name).join(", ")}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-b border-black/10">
                <span className="font-medium text-ink">Available Sizes:</span>
                <span className="text-muted">{availableSizes.join(", ") || "N/A"}</span>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div>
              {hasReviews ? (
                <div className="space-y-6">
                  {product.reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-black/10 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-ink">{review.user?.name || "Anonymous"}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-muted">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-ink/80">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted mb-4">No reviews yet. Be the first to review this product!</p>
                  <button className="bg-brand text-white px-6 py-2 rounded font-semibold hover:bg-brand-dark transition">
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
