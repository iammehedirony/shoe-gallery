"use client";

import { useState } from "react";
import Image from "next/image";
import { useOrders } from "@/src/hooks/queries/useOrders";
import { useUpdateOrderStatus, useUpdatePaymentStatus } from "@/src/hooks/mutations/useUpdateOrder";
import { AdminOrder } from "@/src/lib/services/order.service";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["UNPAID", "PAID", "FAILED", "REFUNDED"];

export default function OrdersPage() {
  const { data: ordersData, isLoading, isError, error } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const updatePaymentMutation = useUpdatePaymentStatus();

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const orders = ordersData || [];

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status });
    } catch (err: any) {
      alert(err.message || "Failed to update order status");
    }
  };

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
          <p className="text-sm text-ink/60">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="font-bold text-base">Failed to load orders</h3>
        <p className="mt-1 text-sm">{error?.message || "Could not connect to backend API."}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-sm text-ink/60">Manage customer orders, fulfillment status, and payments.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-ink/60">
            <p className="text-base font-medium">No orders found</p>
            <p className="text-xs text-ink/40 mt-1">Customer orders will appear here once placed.</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50 text-ink/70 border-b text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
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
                  <td className="p-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-white border border-black/15 rounded p-1.5 text-xs font-semibold text-ink outline-none focus:border-brand"
                    >
                      {ORDER_STATUSES.map(status => (
                        <option key={status} value={status} className="bg-white text-ink">{status}</option>
                      ))}
                    </select>
                  </td>
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
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(order.id, "DELIVERED")}
                        disabled={order.status === "DELIVERED" || updateStatusMutation.isPending}
                        className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1.5 rounded hover:bg-green-100 transition disabled:opacity-50"
                        title="Complete Order"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, "CANCELLED")}
                        disabled={order.status === "CANCELLED" || updateStatusMutation.isPending}
                        className="text-xs font-semibold bg-red-50 text-red-700 px-2.5 py-1.5 rounded hover:bg-red-100 transition disabled:opacity-50"
                        title="Cancel Order"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-xs font-semibold text-brand bg-brand/10 px-2.5 py-1.5 rounded hover:bg-brand/20 transition"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold">Order Details #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-xl font-bold text-ink/60 hover:text-ink">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-ink/60 text-xs">Customer Name</p>
                <p className="font-semibold">{selectedOrder.user?.name || selectedOrder.customerName || "Guest"}</p>
              </div>
              <div>
                <p className="text-ink/60 text-xs">Customer Email / Phone</p>
                <p className="font-semibold">{selectedOrder.user?.email || selectedOrder.customerPhone || "N/A"}</p>
              </div>
              <div>
                <p className="text-ink/60 text-xs">Shipping Address</p>
                <p className="font-semibold">{selectedOrder.shippingAddress || "N/A"}, {selectedOrder.shippingCity || ""}</p>
              </div>
              <div>
                <p className="text-ink/60 text-xs">Order Status & Payment</p>
                <p className="font-semibold">{selectedOrder.status} | {selectedOrder.paymentStatus}</p>
              </div>
            </div>

            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-ink/70">Ordered Items</h3>
            <div className="divide-y border rounded-lg mb-6 overflow-hidden">
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 border">
                      <Image src={item.product?.image || "/logo.png"} alt={item.product?.title || "Item"} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.product?.title || "Product"}</p>
                      <p className="text-xs text-ink/60">Qty: {item.quantity} | Price: ৳{Number(item.price).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-brand">৳{(Number(item.price) * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-4 font-bold text-lg">
              <span>Total Amount:</span>
              <span className="text-brand">৳{Number(selectedOrder.totalAmount).toLocaleString()}</span>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-brand text-white px-6 py-2.5 rounded font-bold text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
