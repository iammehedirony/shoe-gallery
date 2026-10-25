"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function AdminPage() {
  const isAuthenticated = true;

  return (
    <div>
      {isAuthenticated ? (
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
  const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // এখানে আপনার ব্যাকএন্ড অথেনটিকেশন লজিক এবং রোল চেকিং বসবে
    // উদাহরণ: if (email === 'admin@richkid.com' && password === 'admin123') ...
    if (email === "admin" && password === "admin") {
      // রোল চেক করার পর রিডাইরেক্ট হবে
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials or unauthorized access.");
    }
  };
  return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm border border-black/10">
        <div className="mb-8 text-center">
            <Image src="/logo.png" alt="RICHKID Logo" width={120} height={40} className="mx-auto" />
            <h1 className="mt-4 text-xl font-bold text-ink">Admin Login</h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Admin Email/Username"
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
            className="w-full rounded bg-brand py-3 font-bold text-white transition hover:opacity-90"
          >
            LOG IN
          </button>
        </form>
      </div>
    </main>
  )
}


function DashboardPage() {
  const stats = [
    { label: "Total Sales", value: "৳1,250,000" },
    { label: "Total Orders", value: "450" },
    { label: "Total Products", value: "120" },
    { label: "Total Customers", value: "850" },
  ];

  const recentOrders = [
    { id: "#3", customer: "Zaman", email: "zaman@example.com", items: 1, total: "৳30,000", status: "Pending", payment: "Unpaid", date: "2026-10-23" },
    { id: "#2", customer: "rony", email: "rony@gmail.com", items: 1, total: "৳30,000", status: "Pending", payment: "Unpaid", date: "2026-10-23" },
  ];

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
            <Link href="/admin/products/new" className="border p-4 rounded hover:border-brand">Add a product</Link>
            <Link href="/admin/orders" className="border p-4 rounded hover:border-brand">Review orders</Link>
            <Link href="/admin/cms" className="border p-4 rounded hover:border-brand">Manage banners</Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h2 className="font-bold mb-4">Low stock</h2>
          <p className="text-ink/60">Stock levels look healthy.</p>
          <Link href="/admin/inventory" className="text-brand font-bold mt-2 block">Open inventory</Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Recent orders</h2>
          <Link href="/admin/orders" className="text-brand font-bold">View all orders</Link>
        </div>
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="text-ink/60 border-b">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-3 font-bold">{order.id}</td>
                <td className="p-3">{order.customer}<br/><span className="text-xs text-ink/50">{order.email}</span></td>
                <td className="p-3">{order.items}</td>
                <td className="p-3">{order.total}</td>
                <td className="p-3"><span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">{order.status}</span></td>
                <td className="p-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{order.payment}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
