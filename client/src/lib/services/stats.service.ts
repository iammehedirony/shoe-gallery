import { apiClient } from "@/src/lib/api/api.client";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockCount: number;
  lowStockVariants: Array<{
    id: string;
    size: string;
    stock: number;
    productId: string;
    product: {
      title: string;
    };
  }>;
}

export const statsService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await apiClient.get<any>("/admin/dashboard/stats");
    return res.data;
  },
};
