"use client";

import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminHeader from "@/src/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = true; 

  return (
    <div className="flex min-h-screen">
      {isAuthenticated && <AdminSidebar />}
      <div className="flex-1 flex flex-col">
     {isAuthenticated && <AdminHeader />}
        <main className="p-8 bg-gray-50 flex-1">{children}</main>
      </div>
    </div>
  );
}
