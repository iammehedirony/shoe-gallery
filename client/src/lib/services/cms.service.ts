import { apiClient } from "@/src/lib/api/api.client";

export interface Banner {
  id: string;
  title: string;
  script?: string;
  tagline?: string;
  image: string;
  alt?: string;
  link?: string;
  type: "HERO" | "SUB_BANNER" | "PROMO";
  sortOrder: number;
  isActive: boolean;
}

export const cmsService = {
  getBanners: async (type?: string, all?: boolean): Promise<Banner[]> => {
    const res = await apiClient.get<any>("/cms/banners", { params: { type, all: all ? "true" : undefined } });
    return res?.data || res;
  },

  createBanner: async (data: Partial<Banner>) => {
    const res = await apiClient.post<any>("/admin/cms/banners", data);
    return res?.data || res;
  },

  deleteBanner: async (id: string) => {
    const res = await apiClient.delete<any>(`/admin/cms/banners/${id}`);
    return res?.data || res;
  },
};
