import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "CUSTOMER";
}

interface AuthState {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
  setAdmin: (admin: AdminUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isAuthenticated: false,
      login: (token: string, admin: AdminUser) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
        set({ token, admin, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        set({ token: null, admin: null, isAuthenticated: false });
      },
      setAdmin: (admin: AdminUser) => set({ admin }),
    }),
    {
      name: "jh-shoe-auth-storage",
    }
  )
);
