import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BadgeItem {
  id: string;
  name: string;
  color: string;
}

interface BadgesState {
  badges: BadgeItem[];
  addBadge: (name: string, color?: string) => void;
  deleteBadge: (id: string) => void;
}

export const useBadgesStore = create<BadgesState>()(
  persist(
    (set) => ({
      badges: [
        { id: "1", name: "New In", color: "bg-blue-100 text-blue-700" },
        { id: "2", name: "Fresh Stock", color: "bg-green-100 text-green-700" },
        { id: "3", name: "Hot", color: "bg-red-100 text-red-700" },
        { id: "4", name: "Limited", color: "bg-orange-100 text-orange-700" },
        { id: "5", name: "Best Seller", color: "bg-purple-100 text-purple-700" },
        { id: "6", name: "Sale", color: "bg-pink-100 text-pink-700" },
      ],
      addBadge: (name: string, color = "bg-gray-100 text-gray-700") =>
        set((state) => ({
          badges: [...state.badges, { id: Date.now().toString(), name, color }],
        })),
      deleteBadge: (id: string) =>
        set((state) => ({
          badges: state.badges.filter((b) => b.id !== id),
        })),
    }),
    {
      name: "jh-shoe-badges-storage",
    }
  )
);
