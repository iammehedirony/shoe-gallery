import { apiClient } from "@/src/lib/api/api.client";

export interface ProductVariantInput {
  size: string;
  stock: number;
}

export interface CreateProductInput {
  title: string;
  slug: string;
  sku: string;
  description?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  badge?: string;
  image: string;
  images?: string[];
  categoryId: string;
  tagIds?: string[];
  isFlashSale?: boolean;
  flashSaleStartTime?: string;
  flashSaleEndTime?: string;
  variants: ProductVariantInput[];
}

export const productService = {
  getProducts: async (params?: Record<string, any>) => {
    const res: any = await apiClient.get<any>("/products", { params });
    if (res?.products) return res;
    if (res?.data?.products) return res.data;
    return res;
  },

  getProductById: async (id: string) => {
    const res: any = await apiClient.get<any>(`/products/${id}`);
    return res?.data || res;
  },

  getCategories: async () => {
    const res: any = await apiClient.get<any>("/products/categories");
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    if (Array.isArray(res?.categories)) return res.categories;
    return [];
  },

  getTags: async () => {
    const res: any = await apiClient.get<any>("/products/tags");
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    if (Array.isArray(res?.tags)) return res.tags;
    return [];
  },

  getBadges: async () => {
    const res: any = await apiClient.get<any>("/products/badges");
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    if (Array.isArray(res?.badges)) return res.badges;
    return [];
  },

  uploadImages: async (formData: FormData) => {
    const res: any = await apiClient.post<any>("/admin/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res?.data || res;
  },

  createProduct: async (data: CreateProductInput) => {
    const res: any = await apiClient.post<any>("/admin/products", data);
    return res?.data || res;
  },

  deleteProduct: async (id: string) => {
    const res: any = await apiClient.delete<any>(`/admin/products/${id}`);
    return res?.data || res;
  },

  addReview: async (productId: string, data: { rating: number; comment?: string }) => {
    const res: any = await apiClient.post<any>(`/products/${productId}/reviews`, data);
    return res?.data || res;
  },
};
