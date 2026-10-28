"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductDetail } from "@/src/hooks/queries/useProducts";
import { productService } from "@/src/lib/services/product.service";
import { useAuthStore } from "@/src/store/authStore";
import { useCartStore } from "@/src/store/cartStore";
import { useToast } from "@/src/contexts/ToastContext";
import { queryKeys } from "@/src/lib/query/query-keys";
import { formatPrice } from "@/src/lib/format";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/src/components/ui/Icons";

interface ProductDetailsClientProps {
  productId: string;
}

export default function ProductDetailsClient({ productId }: ProductDetailsClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { showToast } = useToast();
  const { data: product, isLoading, error } = useProductDetail(productId);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "additional" | "reviews">("description");

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const addReviewMutation = useMutation({
    mutationFn: (data: { rating: number; comment?: string }) => productService.addReview(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
      setIsReviewModalOpen(false);
      setReviewRating(5);
      setReviewComment("");
      showToast("Review submitted successfully!");
    },
    onError: (err: any) => {
      showToast(err.message || "Failed to submit review", "error");
    },
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReviewMutation.mutate({ rating: reviewRating, comment: reviewComment });
  };

  const handleOpenReviewModal = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsReviewModalOpen(true);
  };

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

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const hasReviews = product.reviews && product.reviews.length > 0;
  const averageRating = hasReviews
    ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const availableSizes = product.variants ? product.variants.map((v: any) => v.size) : [];
  const selectedVariant = product.variants?.find((v: any) => v.size === selectedSize);
  const currentStock = selectedVariant ? selectedVariant.stock : 0;

  const handleAddToCart = async () => {
    if (!selectedSize && availableSizes.length > 0) {
      showToast("Please select a size", "error");
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariant?.id,
        title: product.title,
        price: Number(product.price),
        oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
        image: allImages[currentImageIndex] || product.image,
        selectedSize: selectedSize || availableSizes[0] || "Standard",
        quantity,
        stock: currentStock,
      });

      showToast("Product added to cart successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to add to cart", "error");
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize && availableSizes.length > 0) {
      showToast("Please select a size", "error");
      return;
    }

    await handleAddToCart();
    router.push("/checkout");
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-[1240px]">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-brand">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-brand">Shop</Link>
          </li>
          <li>/</li>
          <li className="text-ink font-medium truncate">{product.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Product Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 border border-black/5">
            <Image
              src={allImages[currentImageIndex] || product.image}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {allImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                    currentImageIndex === idx ? "border-brand" : "border-transparent hover:border-black/20"
                  }`}
                >
                  <Image src={img} alt="" fill sizes="25vw" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            {product.category && (
              <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-2 inline-block">
                {product.category.name}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mb-3">{product.title}</h1>

            {/* Rating & Reviews summary */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-bold text-ink">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-muted">({product.reviews?.length || 0} reviews)</span>
            </div>

            {/* Price Section */}
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl bg-gray-50/80 p-4 border border-black/5">
              <span className="text-3xl sm:text-4xl font-black text-brand tracking-tight">
                {formatPrice(Number(product.price))}
              </span>

              {((product.oldPrice && Number(product.oldPrice) > Number(product.price)) || (product.discount > 0 && Number(product.oldPrice) > Number(product.price))) && (
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-semibold text-muted line-through">
                    {formatPrice(Number(product.oldPrice))}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-brand px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-white shadow-sm">
                    {product.discount > 0 ? `${product.discount}% OFF` : "Sale"}
                  </span>
                </div>
              )}

              {product.discount > 0 && (!product.oldPrice || Number(product.oldPrice) <= Number(product.price)) && (
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-semibold text-muted line-through">
                    {formatPrice(Number(product.price) / (1 - product.discount / 100))}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-brand px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-white shadow-sm">
                    {product.discount}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-ink">Select Size (EU):</label>
                  <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: any) => {
                    const isSelected = selectedSize === variant.size;
                    const isOutOfStock = variant.stock === 0;

                    return (
                      <button
                        key={variant.id}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(variant.size)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-bold border transition ${
                          isSelected
                            ? "border-brand bg-brand text-white shadow-sm"
                            : isOutOfStock
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                            : "border-gray-200 hover:border-ink text-ink bg-white"
                        }`}
                      >
                        {variant.size}
                      </button>
                    );
                  })}
                </div>
                {selectedSize && (
                  <p className="text-xs text-muted mt-2">
                    Stock available: <span className="font-semibold text-ink">{currentStock} pairs</span>
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-ink mb-2">Quantity:</label>
              <div className="flex items-center w-32 border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-ink font-bold transition"
                >
                  -
                </button>
                <span className="flex-1 text-center font-semibold text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-ink font-bold transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white border-2 border-brand text-brand hover:bg-brand/5 font-bold py-3.5 px-6 rounded-xl transition shadow-sm"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-brand hover:bg-brand-dark text-white font-bold py-3.5 px-6 rounded-xl transition shadow-sm"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-ink"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-ink mb-4">Footwear Size Guide</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Find your perfect fit using our standard European (EU) sizing chart below.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3 font-semibold text-ink">EU Size</th>
                      <th className="p-3 font-semibold text-ink">US Men</th>
                      <th className="p-3 font-semibold text-ink">Foot Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr><td className="p-3">39</td><td className="p-3">6.5</td><td className="p-3">24.5 cm</td></tr>
                    <tr><td className="p-3">40</td><td className="p-3">7.5</td><td className="p-3">25.0 cm</td></tr>
                    <tr><td className="p-3">41</td><td className="p-3">8.0</td><td className="p-3">26.0 cm</td></tr>
                    <tr><td className="p-3">42</td><td className="p-3">9.0</td><td className="p-3">27.0 cm</td></tr>
                    <tr><td className="p-3">43</td><td className="p-3">10.0</td><td className="p-3">28.0 cm</td></tr>
                    <tr><td className="p-3">44</td><td className="p-3">11.0</td><td className="p-3">28.5 cm</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-ink">Customer Reviews ({product.reviews?.length || 0})</h3>
                <button
                  onClick={handleOpenReviewModal}
                  className="bg-brand text-white px-4 py-2 rounded text-sm font-semibold hover:bg-brand-dark transition"
                >
                  Write a Review
                </button>
              </div>

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
                  <button
                    onClick={handleOpenReviewModal}
                    className="bg-brand text-white px-6 py-2 rounded font-semibold hover:bg-brand-dark transition"
                  >
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <h3 className="text-lg font-bold text-ink">Write a Review</h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-gray-400 hover:text-ink font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl focus:outline-none transition-transform hover:scale-110"
                    >
                      <span className={star <= (hoverRating || reviewRating) ? "text-yellow-400" : "text-gray-300"}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-ink">({reviewRating}/5)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Your Review</label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-brand text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addReviewMutation.isPending}
                  className="px-5 py-2 bg-brand text-white rounded text-sm font-medium hover:bg-brand-dark transition disabled:opacity-50"
                >
                  {addReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
