import { apiClient } from "@/src/lib/api/api.client";

export interface InventoryVariant {
  id: string;
  size: string;
  stock: number;
  productId: string;
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    sku: string;
  };
}

export interface InventoryResponse {
  variants: InventoryVariant[];
  stats: {
    totalProducts: number;
    outOfStockCount: number;
    lowStockCount: number;
    totalInventoryValue: number;
  };
}

export const inventoryService = {
  getInventory: async (): Promise<InventoryResponse> => {
    const res = await apiClient.get<any>("/admin/inventory");
    return res.data;
  },

  updateStock: async ({ variantId, stock }: { variantId: string; stock: number }) => {
    const res = await apiClient.patch<any>(`/admin/inventory/${variantId}`, { stock });
    return res.data;
  },
};
