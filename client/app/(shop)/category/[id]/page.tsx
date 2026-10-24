"use client";

import ProductCard from "@/src/components/product/ProductCard";
import { newArrivalProducts } from "@/src/data/mockProducts";
import { useState, use } from "react";

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const categoryName = id.replace("-", " ");
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64">
          <div 
            className="lg:hidden mb-4 p-4 bg-gray-100 rounded font-semibold text-center cursor-pointer"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            FILTERS
          </div>
          
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
            <h2 className="font-bold text-lg mb-4">EXPLORE BY CATEGORY</h2>
            <ul className="space-y-2 text-sm text-ink/70">
              {["Accessories", "Belt", "Football", "Kids", "Men", "Women"].map(cat => (
                <li key={cat} className="flex justify-between hover:text-brand cursor-pointer">
                  {cat} <span>(15)</span>
                </li>
              ))}
            </ul>
            
            <h2 className="font-bold text-lg mt-8 mb-4">FILTER BY</h2>
            <div className="space-y-1">
              {["Size/37", "Size/38", "Size/39", "Size/40"].map(size => (
                <label key={size} className="flex items-center gap-2 text-sm text-ink/70">
                  <input type="checkbox" /> {size} (2)
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          <h1 className="text-2xl font-bold mb-6 capitalize">{categoryName}</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {newArrivalProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
