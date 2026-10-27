"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ProductCard from "@/src/components/product/ProductCard";
import { productService } from "@/src/lib/services/product.service";
import { useInfiniteProducts } from "@/src/hooks/queries/useInfiniteProducts";

export default function ShopPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Infinite scroll trigger
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
  });

  // Use infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteProducts({
    category: selectedCategory || undefined,
    tag: selectedTag || undefined,
    size: selectedSize || undefined,
    sort: sortBy || undefined,
    limit: 12,
  });

  // Fetch metadata (categories, tags)
  useEffect(() => {
    async function fetchMetaData() {
      try {
        const [catRes, tagRes] = await Promise.all([
          productService.getCategories(),
          productService.getTags(),
        ]);
        setCategories(Array.isArray(catRes) ? catRes : []);
        setTags(Array.isArray(tagRes) ? tagRes : []);
      } catch (err) {
        console.error("Failed to load meta data", err);
      }
    }
    fetchMetaData();
  }, []);

  // Trigger next page load when user scrolls into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all products from all pages
  const products = data?.pages.flatMap((page) => page.products) || [];

  return (
    <main className="container mx-auto px-4 py-12 max-w-[1240px]">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64">
          <div
            className="lg:hidden mb-4 p-4 bg-gray-100 rounded font-semibold text-center cursor-pointer text-sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            FILTERS & CATEGORIES ▾
          </div>

          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block space-y-6`}>
            <div>
              <h2 className="font-bold text-base mb-3 uppercase tracking-wider">Categories</h2>
              <ul className="space-y-2 text-sm text-ink/70">
                <li
                  onClick={() => setSelectedCategory("")}
                  className={`cursor-pointer hover:text-brand ${!selectedCategory ? "font-bold text-brand" : ""}`}
                >
                  All Categories
                </li>
                {categories.map((cat: any) => (
                  <li
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`cursor-pointer hover:text-brand ${selectedCategory === cat.slug ? "font-bold text-brand" : ""}`}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-base mb-3 uppercase tracking-wider">Filter by Size</h2>
              <div className="flex flex-wrap gap-2">
                {["38", "39", "40", "41", "42", "43", "44"].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                    className={`px-3 py-1.5 rounded text-xs font-bold border transition ${
                      selectedSize === size ? "bg-brand text-white border-brand" : "bg-white text-ink border-black/15 hover:border-brand"
                    }`}
                  >
                    Size {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold text-base mb-3 uppercase tracking-wider">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: any) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(selectedTag === tag.slug ? "" : tag.slug)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
                      selectedTag === tag.slug ? "bg-ink text-white border-ink" : "bg-gray-50 text-ink/70 border-black/10 hover:border-ink"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold uppercase tracking-wide">All Products</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink/60">Sort By:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border border-black/15 p-2 rounded text-xs bg-white text-ink outline-none focus:border-brand font-medium"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-16 rounded-lg text-center border border-black/10">
              <p className="text-lg font-medium text-ink">No products found matching your filters.</p>
              <button
                onClick={() => { setSelectedCategory(""); setSelectedTag(""); setSelectedSize(""); }}
                className="mt-4 bg-brand text-white px-6 py-2 rounded text-sm font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product: any) => {
                  const formattedProduct = {
                    id: product.id || product._id,
                    slug: product.slug,
                    title: product.title,
                    image: product.image || product.images?.[0] || "/logo.png",
                    price: Number(product.price),
                    oldPrice: product.oldPrice ? Number(product.oldPrice) : Number(product.price),
                    discount: product.discount || 0,
                    sizes: product.variants?.map((v: any) => v.size) || ["39", "40", "41", "42"],
                    badge: product.badge,
                  };
                  return <ProductCard key={product.id || product._id} product={formattedProduct} />;
                })}
              </div>

              {/* Infinite scroll trigger */}
              <div ref={loadMoreRef} className="py-8 text-center">
                {isFetchingNextPage ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
                    <p className="text-sm text-ink/60 font-medium">Loading more products...</p>
                  </div>
                ) : hasNextPage ? (
                  <p className="text-xs text-ink/40">Scroll to load more</p>
                ) : products.length > 0 ? (
                  <div className="border-t border-black/10 pt-6">
                    <p className="text-sm text-ink/50 font-medium">🎉 You've reached the end!</p>
                    <p className="text-xs text-ink/40 mt-1">No more products to show</p>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
