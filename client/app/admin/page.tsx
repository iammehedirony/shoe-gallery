"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/src/lib/store/useAuthStore";
import { apiClient } from "@/src/lib/api/api.client";
import { useDashboardStats } from "@/src/hooks/queries/useDashboardStats";
import { useOrders } from "@/src/hooks/queries/useOrders";

export default function AdminPage() {
  const { isAuthenticated, admin } = useAuthStore();
  const isAdminAuthenticated = isAuthenticated && admin?.role === "ADMIN";

  return (
    <div>
      {isAdminAuthenticated ? (
        <DashboardPage />
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const loginStore = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response: any = await apiClient.post("/auth/login", { email, password });
      const { user, token } = response.data;

      if (user.role !== "ADMIN") {
        setError("Access denied. Admin privileges required.");
        setIsLoading(false);
        return;
      }

      loginStore(token, user);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials or login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm border border-black/10">
        <div className="mb-8 text-center">
            <Image src="/logo.png" alt="JH Shoe Gallery Logo" width={120} height={40} className="mx-auto" />
            <h1 className="mt-4 text-xl font-bold text-ink">Admin Login</h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-black/10 px-4 py-3 outline-none focus:border-brand"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-black/10 px-4 py-3 outline-none focus:border-brand"
            required
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-brand py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "LOGGING IN..." : "LOG IN"}
          </button>
        </form>
      </div>
    </main>
  );
};

function DashboardPage() {
  const { data: statsData, isLoading: statsLoading, isError: statsError, error: statsErr } = useDashboardStats();
  const { data: ordersData, isLoading: ordersLoading, isError: ordersError } = useOrders();

  const stats = [
    { label: "Total Sales", value: statsData ? `৳${statsData.totalRevenue.toLocaleString()}` : "৳0" },
    { label: "Total Orders", value: statsData ? statsData.totalOrders.toLocaleString() : "0" },
    { label: "Total Products", value: statsData ? statsData.totalProducts.toLocaleString() : "0" },
    { label: "Total Customers", value: statsData ? statsData.totalCustomers.toLocaleString() : "0" },
  ];

  if (statsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          <p className="text-sm text-ink/60">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="font-bold text-base">Failed to load dashboard data</h3>
        <p className="mt-1 text-sm">{statsErr?.message || "Could not connect to backend API."}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
            <h3 className="text-sm text-ink/60">{stat.label}</h3>
            <p className="text-2xl font-bold mt-2 text-brand">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h2 className="font-bold mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/products/new" className="border p-4 rounded hover:border-brand text-center font-medium">Add a product</Link>
            <Link href="/admin/orders" className="border p-4 rounded hover:border-brand text-center font-medium">Review orders</Link>
            <Link href="/admin/cms" className="border p-4 rounded hover:border-brand text-center font-medium">Manage banners</Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Low stock alerts</h2>
            <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
              {statsData?.lowStockCount || 0} items
            </span>
          </div>
          {statsData?.lowStockVariants && statsData.lowStockVariants.length > 0 ? (
            <div className="space-y-2 max-h-36 overflow-y-auto mb-4 pr-1">
              {statsData.lowStockVariants.map((item) => (
                <div key={item.id} className="text-xs flex justify-between items-center border-b pb-1.5">
                  <span className="font-medium text-ink truncate max-w-[220px]">
                    {item.product.title} <span className="text-ink/50">(Size: {item.size})</span>
                  </span>
                  <span className="text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">Stock: {item.stock}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink/60 text-sm mb-4">Stock levels look healthy.</p>
          )}
          <Link href="/admin/inventory" className="text-brand font-bold text-sm block">Open inventory →</Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Recent orders</h2>
          <Link href="/admin/orders" className="text-brand font-bold text-sm">View all orders →</Link>
        </div>

        {ordersLoading ? (
          <div className="py-8 text-center text-sm text-ink/60">Loading orders...</div>
        ) : ordersError ? (
          <div className="py-8 text-center text-sm text-red-600">Failed to load recent orders.</div>
        ) : !ordersData || ordersData.length === 0 ? (
          <div className="py-12 text-center text-ink/60">
            <p className="text-base font-medium">No orders found</p>
            <p className="text-xs text-ink/40 mt-1">When customers place orders, they will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="text-ink/60 border-b text-xs uppercase tracking-wider">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {ordersData.slice(0, 5).map((order) => {
                const totalItems = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 font-bold text-xs font-mono">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="p-3">
                      <div className="font-medium text-ink">{order.user?.name || "Guest Customer"}</div>
                      <div className="text-xs text-ink/50">{order.user?.email || "N/A"}</div>
                    </td>
                    <td className="p-3">{totalItems}</td>
                    <td className="p-3 font-semibold text-brand">৳{Number(order.totalAmount).toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                        order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === "PAID" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-ink/60">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
