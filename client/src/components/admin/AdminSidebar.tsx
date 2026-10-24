"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Inventory", href: "/admin/inventory" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Payments", href: "/admin/payments" },
  { label: "Customers", href: "/admin/customers" },
  { label: "CMS", href: "/admin/cms" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="w-64 bg-ink text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-brand">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === `/admin${item.href}`; // Assuming structure /admin/...
          return (
            <Link
              key={item.label}
              href={`/${item.href.replace("/", "")}`} // Adjust based on final structure
              className={`px-4 py-3 rounded-lg transition-colors font-medium ${
                isActive ? "bg-brand text-white" : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="w-full px-4 py-3 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors font-semibold">
          Sign Out
        </button>
      </div>
    </aside>
  );
}
