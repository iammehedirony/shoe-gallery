import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiClient } from "@/src/lib/api/api.client";

export interface CartItem {
  id: string; // unique identifier (backend itemId or productId-size)
  productId: string;
  variantId?: string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  selectedSize: string;
  quantity: number;
  stock?: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, "id"> & { id?: string }) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCartWithBackend: () => Promise<void>;
  fetchBackendCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addToCart: async (newItem) => {
        const cartItemId = newItem.id || `${newItem.productId}-${newItem.selectedSize}`;
        const existingIndex = get().items.findIndex(
          (i) => i.id === cartItemId || (i.productId === newItem.productId && i.selectedSize === newItem.selectedSize)
        );

        let updatedItems = [...get().items];
        if (existingIndex > -1) {
          updatedItems[existingIndex].quantity += newItem.quantity || 1;
        } else {
          updatedItems.push({ ...newItem, id: cartItemId, quantity: newItem.quantity || 1 });
        }

        set({ items: updatedItems });

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          try {
            await apiClient.post("/cart/items", {
              productId: newItem.productId,
              variantId: newItem.variantId,
              size: newItem.selectedSize,
              quantity: newItem.quantity || 1,
            });
            await get().fetchBackendCart();
          } catch (err) {
            console.error("Failed to add to backend cart", err);
          }
        }
      },

      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          try {
            const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
            if (isUuid) {
              await apiClient.patch(`/cart/items/${id}`, { quantity });
              await get().fetchBackendCart();
            }
          } catch (err) {
            console.error("Failed to update backend cart item", err);
          }
        }
      },

      removeItem: async (id) => {
        const item = get().items.find((i) => i.id === id);
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token && item) {
          try {
            const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
            if (isUuid) {
              await apiClient.delete(`/cart/items/${id}`);
              await get().fetchBackendCart();
            }
          } catch (err) {
            console.error("Failed to remove backend cart item", err);
          }
        }
      },

      clearCart: async () => {
        set({ items: [] });
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          try {
            await apiClient.delete("/cart/clear");
          } catch (err) {
            console.error("Failed to clear backend cart", err);
          }
        }
      },

      fetchBackendCart: async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;
        try {
          set({ isLoading: true });
          const res: any = await apiClient.get("/cart");
          const cart = res?.data || res;
          if (cart && cart.items) {
            const mappedItems: CartItem[] = cart.items.map((ci: any) => ({
              id: ci.id,
              productId: ci.productId,
              variantId: ci.variantId,
              title: ci.product?.title || "Product",
              price: Number(ci.product?.price || 0),
              oldPrice: ci.product?.oldPrice ? Number(ci.product.oldPrice) : undefined,
              image: ci.product?.image || "/images/placeholder.jpg",
              selectedSize: ci.size,
              quantity: ci.quantity,
              stock: ci.variant?.stock,
            }));
            set({ items: mappedItems, isLoading: false });
          }
        } catch (err) {
          set({ isLoading: false });
          console.error("Failed to fetch backend cart", err);
        }
      },

      syncCartWithBackend: async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;
        const localItems = get().items;
        try {
          set({ isLoading: true });
          const payload = localItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            size: i.selectedSize,
            quantity: i.quantity,
          }));
          const res: any = await apiClient.post("/cart/sync", { items: payload });
          const cart = res?.data || res;
          if (cart && cart.items) {
            const mappedItems: CartItem[] = cart.items.map((ci: any) => ({
              id: ci.id,
              productId: ci.productId,
              variantId: ci.variantId,
              title: ci.product?.title || "Product",
              price: Number(ci.product?.price || 0),
              oldPrice: ci.product?.oldPrice ? Number(ci.product.oldPrice) : undefined,
              image: ci.product?.image || "/images/placeholder.jpg",
              selectedSize: ci.size,
              quantity: ci.quantity,
              stock: ci.variant?.stock,
            }));
            set({ items: mappedItems, isLoading: false });
          }
        } catch (err) {
          set({ isLoading: false });
          console.error("Failed to sync cart", err);
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
