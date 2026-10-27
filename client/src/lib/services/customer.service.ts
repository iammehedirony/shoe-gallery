import { apiClient } from "@/src/lib/api/api.client";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    orders: number;
  };
  orders?: Array<{
    totalAmount: number;
    paymentStatus: string;
  }>;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    const res = await apiClient.get<any>("/admin/customers");
    return res?.data || res;
  },

  createCustomer: async (data: CreateCustomerInput) => {
    const res = await apiClient.post<any>("/auth/register", data);
    return res?.data || res;
  },

  updateCustomer: async ({ id, data }: { id: string; data: Partial<Customer> }) => {
    const res = await apiClient.patch<any>(`/admin/customers/${id}`, data);
    return res?.data || res;
  },

  deleteCustomer: async (id: string) => {
    const res = await apiClient.delete<any>(`/admin/customers/${id}`);
    return res?.data || res;
  },
};
