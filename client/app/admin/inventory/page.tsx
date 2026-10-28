"use client";

import { useState } from "react";
import Image from "next/image";
import { useInventory } from "@/src/hooks/queries/useInventory";
import { useUpdateStock } from "@/src/hooks/mutations/useUpdateStock";

export default function InventoryPage() {
  const { data: inventoryData, isLoading, isError, error } = useInventory();
  const updateStockMutation = useUpdateStock();

  const [managingProduct, setManagingProduct] = useState<any | null>(null);
  const [variantStockInputs, setVariantStockInputs] = useState<Record<string, number>>({});
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);

  const variants = inventoryData?.variants || [];
  const stats = inventoryData?.stats || {
    totalProducts: 0,
    outOfStockCount: 0,
    lowStockCount: 0,
    totalInventoryValue: 0,
  };

  // Group variants by productId
  const productMap = new Map<string, {
    product: any;
    variants: Array<{ id: string; size: string; stock: number; productId: string }>;
    totalStock: number;
  }>();

  variants.forEach((v: any) => {
    const pId = v.productId || v.product?.id;
    if (!pId) return;
    if (!productMap.has(pId)) {
      productMap.set(pId, {
        product: v.product,
        variants: [],
        totalStock: 0,
      });
    }
    const group = productMap.get(pId)!;
    group.variants.push(v);
    group.totalStock += (v.stock || 0);
  });

  const groupedProducts = Array.from(productMap.values());

  // Compute stats based on total aggregated stock per product
  const computedOutOfStockCount = groupedProducts.filter(p => p.totalStock === 0).length;
  const computedLowStockCount = groupedProducts.filter(p => p.totalStock > 0 && p.totalStock <= 5).length;

  const handleOpenManageModal = (group: any) => {
    setManagingProduct(group);
    const initialInputs: Record<string, number> = {};
    group.variants.forEach((v: any) => {
      initialInputs[v.id] = v.stock;
    });
    setVariantStockInputs(initialInputs);
  };

  const handleVariantInputChange = (variantId: string, value: number) => {
    setVariantStockInputs(prev => ({
      ...prev,
      [variantId]: value < 0 ? 0 : value,
    }));
  };

  const handleSaveAllVariantStocks = async () => {
    if (!managingProduct) return;
    setIsUpdatingAll(true);
    try {
      const promises = managingProduct.variants.map((v: any) => {
        const newStock = variantStockInputs[v.id] !== undefined ? variantStockInputs[v.id] : v.stock;
        if (newStock !== v.stock) {
          return updateStockMutation.mutateAsync({ variantId: v.id, stock: Number(newStock) });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      alert("Stock updated successfully!");
      setManagingProduct(null);
    } catch (err: any) {
      alert(err.message || "Failed to update stock");
    } finally {
      setIsUpdatingAll(false);
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
      
      {/* Overview Cards (Preserving Total Products and Total Inventory Value, using aggregated Low Stock & Out of Stock counts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Total Products</h3>
          <p className="text-2xl font-bold mt-2 text-ink">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Out of Stock</h3>
          <p className="text-2xl font-bold mt-2 text-red-500">{computedOutOfStockCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Low Stock</h3>
          <p className="text-2xl font-bold mt-2 text-orange-500">{computedLowStockCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Total Inventory Value</h3>
          <p className="text-2xl font-bold mt-2 text-brand">৳{Number(stats.totalInventoryValue).toLocaleString()}</p>
        </div>
      </div>

      {/* Inventory Table (Grouped by Product) */}
      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        {groupedProducts.length === 0 ? (
          <div className="py-16 text-center text-ink/60">No inventory products found.</div>
        ) : (
          <table className="w-full text-left min-w-[750px]">
            <thead className="bg-gray-50 text-ink/70 border-b text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Product Title</th>
                <th className="p-4">Sizes & Stock</th>
                <th className="p-4">Price</th>
                <th className="p-4">Total Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {groupedProducts.map((group) => {
                const totalStock = group.totalStock;
                const status = 
                  totalStock === 0 ? { label: "Out of Stock", class: "bg-red-100 text-red-700" } :
                  totalStock <= 5 ? { label: "Low Stock", class: "bg-orange-100 text-orange-700" } :
                  { label: "In Stock", class: "bg-green-100 text-green-700" };

                const imageUrl = group.product?.image || "/logo.png";

                return (
                  <tr key={group.product?.id || group.product?._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 w-16">
                      <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 border border-black/5">
                        <Image src={imageUrl} alt={group.product?.title || "Product"} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-medium text-ink">
                      <div>{group.product?.title || "N/A"}</div>
                      <div className="text-xs text-ink/50 font-mono">SKU: {group.product?.sku || "N/A"}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {group.variants.map((v: any) => (
                          <span key={v.id} className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-ink">
                            Size {v.size}: <span className="ml-1 text-brand">{v.stock}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-brand">৳{Number(group.product?.price || 0).toLocaleString()}</td>
                    <td className="p-4 font-bold text-base">{totalStock}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.class}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleOpenManageModal(group)}
                        className="bg-brand text-white text-xs font-bold px-3 py-2 rounded hover:opacity-95 transition shadow-sm"
                      >
                        Update Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Manage Sizes & Stock Modal */}
      {managingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
              <div>
                <h3 className="text-lg font-bold text-ink">Manage Stock by Size</h3>
                <p className="text-xs text-ink/60 truncate max-w-[300px]">{managingProduct.product?.title}</p>
              </div>
              <button 
                onClick={() => setManagingProduct(null)} 
                className="text-gray-400 hover:text-ink font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto pr-1">
              {managingProduct.variants.map((v: any) => (
                <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border border-black/10 bg-gray-50/50">
                  <span className="font-semibold text-sm text-ink">Size {v.size}</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      min="0"
                      value={variantStockInputs[v.id] !== undefined ? variantStockInputs[v.id] : v.stock}
                      onChange={(e) => handleVariantInputChange(v.id, parseInt(e.target.value) || 0)}
                      className="border border-black/15 p-2 rounded w-24 text-sm outline-none focus:border-brand text-ink bg-white font-semibold text-center"
                    />
                    <span className="text-xs text-muted">pairs</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setManagingProduct(null)}
                className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdatingAll || updateStockMutation.isPending}
                onClick={handleSaveAllVariantStocks}
                className="px-5 py-2 bg-brand text-white rounded text-sm font-bold hover:opacity-95 transition disabled:opacity-50 shadow-sm"
              >
                {isUpdatingAll ? "Saving..." : "Save All Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
