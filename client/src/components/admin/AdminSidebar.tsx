"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/useAuthStore";

const menuItems = [
  { label: "Dashboard", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Tags & Badges", href: "/tags-badges" },
  { label: "Inventory", href: "/inventory" },
  { label: "Orders", href: "/orders" },
  { label: "Payments", href: "/payments" },
  { label: "Customers", href: "/customers" },
  { label: "CMS", href: "/cms" },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = () => {
    logout();
    if (onClose) onClose();
    router.push("/admin");
  };
  
  return (
    <aside className="w-full lg:w-64 bg-ink text-white h-screen flex flex-col sticky top-0">
      <div className="p-6 flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold text-brand">Admin Panel</h2>
        {onClose && <button onClick={onClose} className="lg:hidden text-white text-2xl">✕</button>}
      </div>
      
      <nav className="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
        {menuItems.map((item) => {
          const fullHref = item.href === "/" ? "/admin" : `/admin${item.href}`;
          
          const isActive = item.href === "/" 
            ? pathname === "/admin" || pathname === "/admin/"
            : pathname.startsWith(fullHref);

          return (
            <Link
              key={item.label}
              href={fullHref}
              onClick={onClose}
              className={`px-4 py-3 rounded-lg transition-colors font-medium ${
                isActive ? "bg-brand text-white" : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 shrink-0">
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-3 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors font-semibold"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
