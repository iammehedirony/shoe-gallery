import { apiClient } from "@/src/lib/api/api.client";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    title: string;
    image: string;
  };
}

export interface AdminOrder {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
}

export const orderService = {
  getAdminOrders: async (): Promise<AdminOrder[]> => {
    const res = await apiClient.get<any>("/admin/orders");
    return res.data;
  },
};
