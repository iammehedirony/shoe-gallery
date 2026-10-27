import { apiClient } from "@/src/lib/api/api.client";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  name: string;
  phone: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface AddressInput {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  country?: string;
  isDefault?: boolean;
}

export const authService = {
  register: async (data: RegisterInput) => {
    const res: any = await apiClient.post("/auth/register", data);
    return res?.data || res;
  },

  login: async (data: LoginInput) => {
    const res: any = await apiClient.post("/auth/login", data);
    return res?.data || res;
  },

  getMe: async () => {
    const res: any = await apiClient.get("/auth/me");
    return res?.data || res;
  },

  updateProfile: async (data: UpdateProfileInput) => {
    const res: any = await apiClient.put("/auth/profile", data);
    return res?.data || res;
  },

  changePassword: async (data: ChangePasswordInput) => {
    const res: any = await apiClient.post("/auth/change-password", data);
    return res?.data || res;
  },

  getAddresses: async () => {
    const res: any = await apiClient.get("/auth/addresses");
    return res?.data || res;
  },

  addAddress: async (data: AddressInput) => {
    const res: any = await apiClient.post("/auth/addresses", data);
    return res?.data || res;
  },

  updateAddress: async (id: string, data: AddressInput) => {
    const res: any = await apiClient.put(`/auth/addresses/${id}`, data);
    return res?.data || res;
  },

  deleteAddress: async (id: string) => {
    const res: any = await apiClient.delete(`/auth/addresses/${id}`);
    return res?.data || res;
  },

  logout: () => {
    // Clear token from storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
};
