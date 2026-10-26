"use client";

import { useAuthStore } from "@/src/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { admin, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  return (
    <header className="h-16 bg-white border-b border-black/10 flex items-center justify-between px-4 md:px-8">
      <button onClick={onMenuClick} className="lg:hidden p-2 text-ink">
        ☰
      </button>
      <div className="font-bold text-ink">Admin Portal</div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold hidden md:block">{admin?.name || "Admin User"}</span>
        <button
          onClick={handleLogout}
          className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded font-semibold hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
