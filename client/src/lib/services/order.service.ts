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
  orderNumber?: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  customerName?: string;
  customerPhone?: string;
  shippingCity?: string;
  shippingAddress?: string;
  items: OrderItem[];
}

export const orderService = {
  getMyOrders: async (): Promise<AdminOrder[]> => {
    const res = await apiClient.get<any>("/orders/my-orders");
    return res.data;
  },

  getAdminOrders: async (): Promise<AdminOrder[]> => {
    const res = await apiClient.get<any>("/admin/orders");
    return res.data;
  },

  updateOrderStatus: async ({ orderId, status }: { orderId: string; status: string }) => {
    const res = await apiClient.patch<any>(`/admin/orders/${orderId}/status`, { status });
    return res.data;
  },

  updatePaymentStatus: async ({ orderId, paymentStatus }: { orderId: string; paymentStatus: string }) => {
    const res = await apiClient.patch<any>(`/admin/orders/${orderId}/payment`, { paymentStatus });
    return res.data;
  },
};
