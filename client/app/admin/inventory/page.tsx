"use client";

import { useState } from "react";
import Image from "next/image";
import { useInventory } from "@/src/hooks/queries/useInventory";
import { useUpdateStock } from "@/src/hooks/mutations/useUpdateStock";

export default function InventoryPage() {
  const { data: inventoryData, isLoading, isError, error } = useInventory();
  const updateStockMutation = useUpdateStock();

  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});

  const variants = inventoryData?.variants || [];
  const stats = inventoryData?.stats || {
    totalProducts: 0,
    outOfStockCount: 0,
    lowStockCount: 0,
    totalInventoryValue: 0,
  };

  const handleStockInputChange = (variantId: string, value: number) => {
    setStockInputs(prev => ({
      ...prev,
      [variantId]: value,
    }));
  };

  const handleSaveStock = async (variantId: string, currentStock: number) => {
    const newStock = stockInputs[variantId] !== undefined ? stockInputs[variantId] : currentStock;
    try {
      await updateStockMutation.mutateAsync({ variantId, stock: Number(newStock) });
      alert("Stock updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update stock");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          <p className="text-sm text-ink/60">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="font-bold text-base">Failed to load inventory</h3>
        <p className="mt-1 text-sm">{error?.message || "Could not connect to backend API."}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Inventory Management</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Total Products</h3>
          <p className="text-2xl font-bold mt-2 text-ink">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Out of Stock</h3>
          <p className="text-2xl font-bold mt-2 text-red-500">{stats.outOfStockCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Low Stock</h3>
          <p className="text-2xl font-bold mt-2 text-orange-500">{stats.lowStockCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Total Inventory Value</h3>
          <p className="text-2xl font-bold mt-2 text-brand">৳{Number(stats.totalInventoryValue).toLocaleString()}</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        {variants.length === 0 ? (
          <div className="py-16 text-center text-ink/60">No inventory variants found.</div>
        ) : (
          <table className="w-full text-left min-w-[750px]">
            <thead className="bg-gray-50 text-ink/70 border-b text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Product Title</th>
                <th className="p-4">Size</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {variants.map((variant: any) => {
                const stock = variant.stock;
                const status = 
                  stock === 0 ? { label: "Out of Stock", class: "bg-red-100 text-red-700" } :
                  stock <= 5 ? { label: "Low Stock", class: "bg-orange-100 text-orange-700" } :
                  { label: "In Stock", class: "bg-green-100 text-green-700" };

                const imageUrl = variant.product?.image || "/logo.png";

                return (
                  <tr key={variant.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 w-16">
                      <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 border border-black/5">
                        <Image src={imageUrl} alt={variant.product?.title || "Product"} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-medium text-ink">
                      <div>{variant.product?.title || "N/A"}</div>
                      <div className="text-xs text-ink/50 font-mono">SKU: {variant.product?.sku || "N/A"}</div>
                    </td>
                    <td className="p-4 font-semibold">Size {variant.size}</td>
                    <td className="p-4 font-semibold text-brand">৳{Number(variant.product?.price || 0).toLocaleString()}</td>
                    <td className="p-4 font-bold">{stock}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.class}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          min="0"
                          defaultValue={stock}
                          onChange={(e) => handleStockInputChange(variant.id, parseInt(e.target.value) || 0)}
                          className="border border-black/15 p-2 rounded w-20 text-sm outline-none focus:border-brand text-ink"
                        />
                        <button
                          onClick={() => handleSaveStock(variant.id, stock)}
                          disabled={updateStockMutation.isPending}
                          className="bg-brand text-white text-xs font-bold px-3 py-2 rounded hover:opacity-95 transition disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
