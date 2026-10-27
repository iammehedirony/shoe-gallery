"use client";

import { useOrders } from "@/src/hooks/queries/useOrders";
import { useUpdatePaymentStatus } from "@/src/hooks/mutations/useUpdateOrder";

const PAYMENT_STATUSES = ["UNPAID", "PAID", "FAILED", "REFUNDED"];

export default function PaymentsPage() {
  const { data: ordersData, isLoading, isError, error } = useOrders();
  const updatePaymentMutation = useUpdatePaymentStatus();

  const orders = ordersData || [];

  const totalPaidRevenue = orders
    .filter(o => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const totalUnpaidAmount = orders
    .filter(o => o.paymentStatus === "UNPAID")
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const handlePaymentStatusChange = async (orderId: string, paymentStatus: string) => {
    try {
      await updatePaymentMutation.mutateAsync({ orderId, paymentStatus });
    } catch (err: any) {
      alert(err.message || "Failed to update payment status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          <p className="text-sm text-ink/60">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="font-bold text-base">Failed to load payments</h3>
        <p className="mt-1 text-sm">{error?.message || "Could not connect to backend API."}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Payment Management</h1>
          <p className="text-sm text-ink/60">Track store revenue, payment methods, and transaction statuses.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Total Paid Revenue</h3>
          <p className="text-2xl font-bold mt-2 text-brand">৳{totalPaidRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Pending / Unpaid Amount</h3>
          <p className="text-2xl font-bold mt-2 text-orange-600">৳{totalUnpaidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Total Transactions</h3>
          <p className="text-2xl font-bold mt-2 text-ink">{orders.length}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-ink/60">
            <p className="text-base font-medium">No payment transactions found</p>
            <p className="text-xs text-ink/40 mt-1">Transactions will appear here when orders are placed.</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 text-ink/70 border-b text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold font-mono text-xs">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="p-4">
                    <div className="font-medium text-ink">{order.user?.name || order.customerName || "Guest"}</div>
                    <div className="text-xs text-ink/50">{order.user?.email || order.customerPhone || "N/A"}</div>
                  </td>
                  <td className="p-4 font-semibold text-brand">৳{Number(order.totalAmount).toLocaleString()}</td>
                  <td className="p-4 font-medium uppercase text-xs">{order.paymentMethod || "COD"}</td>
                  <td className="p-4">
                    <select 
                      value={order.paymentStatus}
                      onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                      className="bg-white border border-black/15 rounded p-1.5 text-xs font-semibold text-ink outline-none focus:border-brand"
                    >
                      {PAYMENT_STATUSES.map(status => (
                        <option key={status} value={status} className="bg-white text-ink">{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-xs text-ink/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
