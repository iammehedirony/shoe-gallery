"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/src/components/product/ProductCard";
import { productService } from "@/src/lib/services/product.service";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

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

  useEffect(() => {
    async function fetchShopProducts() {
      setIsLoading(true);
      try {
        const params: Record<string, any> = {};
        if (selectedCategory) params.category = selectedCategory;
        if (selectedTag) params.tag = selectedTag;
        if (selectedSize) params.size = selectedSize;
        if (sortBy) params.sort = sortBy;

        const res = await productService.getProducts(params);
        setProducts(res?.products || res?.data?.products || (Array.isArray(res) ? res : []));
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchShopProducts();
  }, [selectedCategory, selectedTag, selectedSize, sortBy]);

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
            <div className="py-24 text-center text-ink/60">Loading products...</div>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product: any) => {
                const formattedProduct = {
                  id: product.id,
                  title: product.title,
                  image: product.image || product.images?.[0] || "/logo.png",
                  price: Number(product.price),
                  oldPrice: product.oldPrice ? Number(product.oldPrice) : Number(product.price),
                  discount: product.discount || 0,
                  sizes: product.variants?.map((v: any) => v.size) || ["39", "40", "41", "42"],
                  badge: product.badge,
                };
                return <ProductCard key={product.id} product={formattedProduct} />;
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
