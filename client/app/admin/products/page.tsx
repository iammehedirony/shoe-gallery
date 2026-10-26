"use client";

import { useState } from "react";
import { newArrivalProducts } from "@/src/data/mockProducts";

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand text-white px-6 py-2 rounded font-bold"
        >
          Add New Product
        </button>
      </div>
      
      {/* Product Table */}
      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 text-ink/70">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {newArrivalProducts.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-4 font-medium">{product.title}</td>
                <td className="p-4">{product.price}৳</td>
                <td className="p-4">10</td>
                <td className="p-4">
                  <button className="text-brand font-bold mr-4">Edit</button>
                  <button className="text-red-500 font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Product</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-2xl">✕</button>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Product Title *" className="border p-3 rounded col-span-2" required />
                <input type="number" placeholder="Price *" className="border p-3 rounded" required />
                <input type="number" placeholder="Discount Price" className="border p-3 rounded" />
                <select className="border p-3 rounded">
                    <option>Select Category</option>
                    <option>Men</option>
                    <option>Women</option>
                </select>
                <select className="border p-3 rounded">
                    <option>Select Sub-Category</option>
                    <option>Casual Shoes</option>
                    <option>Formal Shoes</option>
                    <option>Boots</option>
                </select>
                <input type="number" placeholder="Stock Quantity *" className="border p-3 rounded" required />
                <textarea placeholder="Description" className="border p-3 rounded col-span-2 h-32"></textarea>
                
                <div className="col-span-2">
                    <label className="block mb-2 font-semibold">Select Sizes</label>
                    <div className="flex flex-wrap gap-4">
                        {["37", "38", "39", "40", "41", "42", "43", "44"].map(size => (
                            <label key={size} className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4" /> Size {size}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="col-span-2 flex items-center gap-4 border p-3 rounded">
                    <label className="flex items-center gap-2 font-semibold">
                        <input type="checkbox" className="w-4 h-4" /> Is Flash Sale Product?
                    </label>
                    <div className="flex-1">
                        <label className="text-sm font-semibold block mb-1">Flash Sale End Date</label>
                        <input type="date" className="border p-2 rounded w-full" />
                    </div>
                </div>

                <div className="col-span-2">
                    <label className="block mb-2 font-semibold">Select Tags</label>
                    <div className="flex flex-wrap gap-4">
                        {["Best Selling", "New Arrival", "Hot Deal", "Featured"].map(tag => (
                            <label key={tag} className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4" /> {tag}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="col-span-2">
                    <label className="block mb-2 font-semibold">Upload Images</label>
                    <input type="file" multiple className="border p-3 rounded w-full" />
                </div>
                <button type="submit" className="bg-brand text-white font-bold py-3 rounded col-span-2">UPLOAD PRODUCT</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
