"use client";

import { useState } from "react";

export default function CategoriesPage() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([
    { id: 1, name: "Men", sub: ["Casual Shoes", "Formal Shoes", "Boots", "Sandals"] },
    { id: 2, name: "Women", sub: ["Heels", "Flats", "Sneakers"] },
    { id: 3, name: "Accessories", sub: ["Belt", "Socks"] },
  ]);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Categories & Sub-Categories</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex-1 md:flex-none bg-brand text-white px-4 py-2 rounded font-bold text-xs md:text-sm"
          >
            Add New Category
          </button>
          <button 
            onClick={() => setIsSubcategoryModalOpen(true)}
            className="flex-1 md:flex-none bg-ink text-white px-4 py-2 rounded font-bold text-xs md:text-sm"
          >
            Create Subcategory
          </button>
        </div>
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <input type="text" placeholder="Category Name" className="w-full border p-3 rounded mb-4" />
            <div className="flex gap-4">
              <button onClick={() => setIsCategoryModalOpen(false)} className="flex-1 border p-2 rounded">Cancel</button>
              <button className="flex-1 bg-brand text-white p-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {isSubcategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Create Subcategory</h2>
            <input type="text" placeholder="Subcategory Name" className="w-full border p-3 rounded mb-4" />
            <select className="w-full border p-3 rounded mb-4">
              <option value="">Select Parent Category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <div className="flex gap-4">
              <button onClick={() => setIsSubcategoryModalOpen(false)} className="flex-1 border p-2 rounded">Cancel</button>
              <button className="flex-1 bg-brand text-white p-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-black/10">
            <div className="flex justify-between items-center mb-4 gap-2">
              <h2 className="text-sm md:text-lg font-bold text-ink truncate">{cat.name}</h2>
              <button className="text-brand text-[10px] md:text-sm font-semibold whitespace-nowrap">Add Sub-category</button>
            </div>
            <ul className="space-y-2">
              {cat.sub.map((sub) => (
                <li key={sub} className="flex justify-between items-center bg-gray-50 p-2 rounded text-[11px] md:text-sm">
                  <span className="truncate">{sub}</span>
                  <button className="text-red-500 text-[10px] md:text-xs ml-2">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
