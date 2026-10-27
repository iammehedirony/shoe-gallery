"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import ProductCard from "@/src/components/product/ProductCard";
import { productService } from "@/src/lib/services/product.service";
import { useInfiniteProducts } from "@/src/hooks/queries/useInfiniteProducts";

export default function CategoryPageClient({ slug, currentSlug }: { slug: string[]; currentSlug: string }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);

  // Build the full category path for nested categories
  const categoryPath = slug.join('/');
  const categoryName = currentSlug.replace(/-/g, " ");

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
    category: categoryPath,
    size: selectedSize || undefined,
    limit: 12,
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await productService.getCategories();
        setCategories(Array.isArray(data) ? data : []);

        // Find current category details from the hierarchy
        let foundCategory = null;
        if (slug.length === 1) {
          // Top-level category
          foundCategory = data.find((cat: any) => cat.slug === slug[0]);
        } else if (slug.length === 2) {
          // Subcategory
          const parent = data.find((cat: any) => cat.slug === slug[0]);
          if (parent?.children) {
            foundCategory = parent.children.find((sub: any) => sub.slug === slug[1]);
          }
        }
        setCurrentCategory(foundCategory);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    fetchCategories();
  }, [slug]);

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
              <h2 className="font-bold text-base mb-3 uppercase tracking-wider">Explore Categories</h2>
              <ul className="space-y-2 text-sm text-ink/70">
                {categories.map((cat: any) => {
                  const isParentActive = slug[0] === cat.slug;
                  return (
                    <li key={cat.id}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className={`hover:text-brand block py-1 ${isParentActive && slug.length === 1 ? "font-bold text-brand" : ""}`}
                      >
                        {cat.name}
                      </Link>
                      {cat.children && cat.children.length > 0 && (
                        <ul className="pl-4 space-y-1 mt-1 border-l border-black/10">
                          {cat.children.map((sub: any) => {
                            const isSubActive = isParentActive && slug[1] === sub.slug;
                            return (
                              <li key={sub.id}>
                                <Link
                                  href={`/category/${cat.slug}/${sub.slug}`}
                                  className={`hover:text-brand text-xs block py-1 ${isSubActive ? "font-bold text-brand" : "text-ink/60"}`}
                                >
                                  - {sub.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
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
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs text-ink/50 mb-2">
              <Link href="/" className="hover:text-brand">Home</Link>
              <span>/</span>
              {slug.map((s, idx) => {
                const path = `/category/${slug.slice(0, idx + 1).join('/')}`;
                const isLast = idx === slug.length - 1;
                return (
                  <span key={idx} className="flex items-center gap-2">
                    <Link href={path} className={`hover:text-brand capitalize ${isLast ? 'text-brand font-medium' : ''}`}>
                      {s.replace(/-/g, ' ')}
                    </Link>
                    {!isLast && <span>/</span>}
                  </span>
                );
              })}
            </div>
            <h1 className="text-2xl font-bold capitalize tracking-wide">
              {currentCategory?.name || categoryName}
            </h1>
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
              <p className="text-lg font-medium text-ink">No products found in this category.</p>
              <p className="text-xs text-ink/50 mt-1">Try selecting another category or resetting filters.</p>
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
