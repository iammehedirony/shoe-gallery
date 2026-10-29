"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useOrders } from "@/src/hooks/queries/useOrders";
import { useUpdateOrderStatus, useUpdatePaymentStatus } from "@/src/hooks/mutations/useUpdateOrder";
import { AdminOrder } from "@/src/lib/services/order.service";
import { customerService } from "@/src/lib/services/customer.service";
import { productService } from "@/src/lib/services/product.service";
import { apiClient } from "@/src/lib/api/api.client";
import { formatPrice } from "@/src/lib/format";
import { useToast } from "@/src/contexts/ToastContext";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["UNPAID", "PAID", "FAILED", "REFUNDED"];

export default function OrdersPage() {
  const { data: ordersData, isLoading, isError, error } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const updatePaymentMutation = useUpdatePaymentStatus();
  const { showToast } = useToast();

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Manual Order Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);

  // New Customer Modal State
  const [isNewCustModalOpen, setIsNewCustModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustPassword, setNewCustPassword] = useState("12345678");

  // Order Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingCity, setShippingCity] = useState("Dhaka");
  const shippingFee = shippingCity.trim().toLowerCase() === "dhaka" ? 60 : 120;
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paidAmount, setPaidAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Order Items State
  const [orderItems, setOrderItems] = useState<Array<{
    productId: string;
    variantId: string;
    size: string;
    quantity: number;
    unitPrice: number;
    availableVariants: any[];
    productTitle: string;
  }>>([
    { productId: "", variantId: "", size: "", quantity: 1, unitPrice: 0, availableVariants: [], productTitle: "" }
  ]);

  useEffect(() => {
    if (isCreateModalOpen) {
      async function fetchMeta() {
        setIsLoadingMeta(true);
        try {
          const [custRes, prodRes] = await Promise.all([
            customerService.getCustomers(),
            productService.getProducts(),
          ]);
          setCustomers(Array.isArray(custRes) ? custRes : []);
          const prodList = prodRes?.products || prodRes?.data?.products || (Array.isArray(prodRes) ? prodRes : []);
          setProducts(prodList);
        } catch (err) {
          console.error("Failed to load customers or products", err);
        } finally {
          setIsLoadingMeta(false);
        }
      }
      fetchMeta();
    }
  }, [isCreateModalOpen]);

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    if (!custId) {
      setCustomerName("");
      setCustomerPhone("");
      return;
    }
    const cust = customers.find(c => (c.id || c._id) === custId);
    if (cust) {
      setCustomerName(cust.name || "");
      setCustomerPhone(cust.phone || cust.email || "");
    }
  };

  const handleAddItem = () => {
    setOrderItems(prev => [
      ...prev,
      { productId: "", variantId: "", size: "", quantity: 1, unitPrice: 0, availableVariants: [], productTitle: "" }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, productId: string) => {
    const prod = products.find(p => (p.id || p._id) === productId);
    if (!prod) return;

    const variants = prod.variants || [];
    const firstVariant = variants[0];

    setOrderItems(prev => {
      const next = [...prev];
      next[index] = {
        productId: prod.id || prod._id,
        variantId: firstVariant?.id || "",
        size: firstVariant?.size || "",
        quantity: 1,
        unitPrice: Number(prod.price) || 0,
        availableVariants: variants,
        productTitle: prod.title,
      };
      return next;
    });
  };

  const handleVariantChange = (index: number, variantId: string) => {
    setOrderItems(prev => {
      const next = [...prev];
      const item = next[index];
      const variant = item.availableVariants.find((v: any) => v.id === variantId);
      if (variant) {
        item.variantId = variant.id;
        item.size = variant.size;
      }
      return next;
    });
  };

  const handleQuantityChange = (index: number, qty: number) => {
    setOrderItems(prev => {
      const next = [...prev];
      next[index].quantity = qty < 1 ? 1 : qty;
      return next;
    });
  };

  const subtotal = orderItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const grandTotal = subtotal + shippingFee;
  const paidNum = Number(paidAmount) || 0;
  const dueAmount = Math.max(0, grandTotal - paidNum);

  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone || !shippingAddress) {
      showToast("Please fill in customer name, phone, and shipping address.", "error");
      return;
    }

    if (orderItems.length === 0 || !orderItems[0].productId || !orderItems[0].variantId) {
      showToast("Please add at least one product with a valid size variant.", "error");
      return;
    }

    try {
      const payload = {
        userId: selectedCustomerId || undefined,
        customerName,
        customerPhone,
        shippingCity,
        shippingAddress,
        orderNotes: orderNotes ? `[Manual Entry] ${orderNotes}` : "[Manual Order Entry]",
        paymentMethod,
        transactionId: (paymentMethod === "BKASH" || paymentMethod === "BANK") ? transactionId : undefined,
        paidAmount: paidNum,
        items: orderItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          size: item.size,
          quantity: item.quantity,
        })),
      };

      await apiClient.post("/orders/checkout", payload);
      showToast("Manual order created successfully and inventory updated!");
      setIsCreateModalOpen(false);
      setSelectedCustomerId("");
      setCustomerName("");
      setCustomerPhone("");
      setShippingAddress("");
      setOrderNotes("");
      setPaidAmount("");
      setTransactionId("");
      setOrderItems([{ productId: "", variantId: "", size: "", quantity: 1, unitPrice: 0, availableVariants: [], productTitle: "" }]);
      window.location.reload();
    } catch (err: any) {
      showToast(err.message || "Failed to create manual order", "error");
    }
  };

  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone || !newCustEmail) {
      showToast("Name, Email, and Phone are required for new customer.", "error");
      return;
    }

    try {
      const res: any = await customerService.createCustomer({
        name: newCustName,
        email: newCustEmail,
        phone: newCustPhone,
        password: newCustPassword,
      });
      const newCust = res?.data || res?.user || res;
      setCustomers(prev => [newCust, ...prev]);
      setSelectedCustomerId(newCust.id || newCust._id);
      setCustomerName(newCust.name);
      setCustomerPhone(newCust.phone || newCustEmail);
      setIsNewCustModalOpen(false);
      setNewCustName("");
      setNewCustEmail("");
      setNewCustPhone("");
      showToast("New customer created and selected!");
    } catch (err: any) {
      showToast(err.message || "Failed to create customer", "error");
    }
  };

  const orders = ordersData || [];

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status });
      showToast("Order status updated successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to update order status", "error");
    }
  };

  const handlePaymentStatusChange = async (orderId: string, paymentStatus: string) => {
    try {
      await updatePaymentMutation.mutateAsync({ orderId, paymentStatus });
      showToast("Payment status updated successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to update payment status", "error");
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
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-sm text-ink/60">Manage customer orders, fulfillment status, and manual entries.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-brand text-white px-6 py-2.5 rounded font-bold text-sm hover:opacity-95 transition shadow-sm w-full sm:w-auto"
        >
          + Create Manual Order
        </button>
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
                <th className="p-3 sm:p-4">Order ID</th>
                <th className="p-3 sm:p-4">Customer</th>
                <th className="p-3 sm:p-4">Total</th>
                <th className="p-3 sm:p-4">Status</th>
                <th className="p-3 sm:p-4">Payment</th>
                <th className="p-3 sm:p-4">Date</th>
                <th className="p-3 sm:p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 sm:p-4 font-bold font-mono text-xs">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="p-3 sm:p-4">
                    <div className="font-medium text-ink">{order.user?.name || order.customerName || "Guest"}</div>
                    <div className="text-xs text-ink/50">{order.user?.email || order.customerPhone || "N/A"}</div>
                  </td>
                  <td className="p-3 sm:p-4 font-semibold text-brand">৳{Number(order.totalAmount).toLocaleString()}</td>
                  <td className="p-3 sm:p-4">
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
                  <td className="p-3 sm:p-4">
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
                  <td className="p-3 sm:p-4 text-xs text-ink/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 sm:p-4">
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

      {/* Manual Order Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-xl w-full max-w-4xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Create Manual Order</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-xl font-bold text-ink/60 hover:text-ink p-1">✕</button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-6">
              {/* Customer Selection & Quick Add */}
              <div className="bg-gray-50 p-4 rounded-xl border border-black/10 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="font-bold text-sm text-ink uppercase tracking-wider">1. Customer Information</h3>
                  <button
                    type="button"
                    onClick={() => setIsNewCustModalOpen(true)}
                    className="text-xs font-bold text-brand bg-brand/10 hover:bg-brand/20 px-3 py-1.5 rounded transition"
                  >
                    + Add New Customer
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold text-xs text-muted">Select Existing Customer</label>
                    <select
                      value={selectedCustomerId}
                      onChange={handleCustomerSelect}
                      className="w-full border border-black/15 p-2.5 rounded-lg text-sm bg-white text-ink outline-none focus:border-brand"
                    >
                      <option value="">{isLoadingMeta ? "Loading customers..." : "--- Search / Select Customer ---"}</option>
                      {customers.map((c: any) => (
                        <option key={c.id || c._id} value={c.id || c._id}>
                          {c.name} ({c.phone || c.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-xs text-muted">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahim Ahmed"
                      className="w-full border border-black/15 p-2.5 rounded-lg text-sm bg-white text-ink outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-xs text-muted">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 01711223344"
                      className="w-full border border-black/15 p-2.5 rounded-lg text-sm bg-white text-ink outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold text-xs text-muted">Delivery City / Area *</label>
                    <select
                      value={shippingCity}
                      onChange={e => setShippingCity(e.target.value)}
                      className="w-full border border-black/15 p-2.5 rounded-lg text-sm bg-white text-ink outline-none focus:border-brand"
                    >
                      <option value="Dhaka">Dhaka (60৳ Delivery)</option>
                      <option value="Outside Dhaka">Outside Dhaka (120৳ Delivery)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-xs text-muted">Shipping Address *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={e => setShippingAddress(e.target.value)}
                      placeholder="House, Road, Area, Thana"
                      className="w-full border border-black/15 p-2.5 rounded-lg text-sm bg-white text-ink outline-none focus:border-brand"
                    />
                  </div>
                </div>
              </div>

              {/* Product Selection */}
              <div className="bg-gray-50 p-4 rounded-xl border border-black/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-ink uppercase tracking-wider">2. Product Selection</h3>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-brand bg-brand/10 hover:bg-brand/20 px-3 py-1.5 rounded transition"
                  >
                    + Add Another Product
                  </button>
                </div>

                <div className="space-y-3">
                  {orderItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white p-3 rounded-lg border border-black/10">
                      <div className="sm:col-span-5">
                        <label className="block text-xs font-semibold text-muted mb-1">Product</label>
                        <select
                          value={item.productId}
                          onChange={e => handleProductChange(index, e.target.value)}
                          className="w-full border border-black/15 p-2 rounded text-xs bg-white text-ink outline-none focus:border-brand"
                        >
                          <option value="">Select Product...</option>
                          {products.map((p: any) => (
                            <option key={p.id || p._id} value={p.id || p._id}>
                              {p.title} (৳{p.price})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-muted mb-1">Size Variant</label>
                        <select
                          value={item.variantId}
                          onChange={e => handleVariantChange(index, e.target.value)}
                          disabled={!item.productId || item.availableVariants.length === 0}
                          className="w-full border border-black/15 p-2 rounded text-xs bg-white text-ink outline-none focus:border-brand disabled:bg-gray-100"
                        >
                          {item.availableVariants.length === 0 ? (
                            <option value="">Select product first</option>
                          ) : (
                            item.availableVariants.map((v: any) => (
                              <option key={v.id} value={v.id}>
                                Size {v.size} (Stock: {v.stock})
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-muted mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                          className="w-full border border-black/15 p-2 rounded text-xs text-ink outline-none focus:border-brand"
                        />
                      </div>

                      <div className="sm:col-span-1 text-right font-bold text-xs text-brand">
                        ৳{(item.unitPrice * item.quantity).toLocaleString()}
                      </div>

                      <div className="sm:col-span-1 text-right">
                        {orderItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-xs font-bold text-red-600 bg-red-50 p-2 rounded hover:bg-red-100 transition"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Summary */}
              <div className="bg-gray-50 p-4 rounded-xl border border-black/10 space-y-4">
                <h3 className="font-bold text-sm text-ink uppercase tracking-wider">3. Payment & Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold text-xs text-muted">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-full border border-black/15 p-2.5 rounded-lg text-sm bg-white text-ink outline-none focus:border-brand"
                    >
                      <option value="CASH">Cash (Paid in person)</option>
                      <option value="COD">Cash on Delivery (COD)</option>
                      <option value="BKASH">bKash Payment</option>
                      <option value="BANK">Bank Account Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-xs text-muted">Paid Amount (৳)</label>
                    <input
                      type="number"
                      min="0"
                      value={paidAmount}
                      onChange={e => setPaidAmount(e.target.value)}
                      placeholder="e.g. 1500"
                      className="w-full border border-black/15 p-2.5 rounded-lg text-sm bg-white text-ink outline-none focus:border-brand font-semibold"
                    />
                  </div>

                  {(paymentMethod === "BKASH" || paymentMethod === "BANK") && (
                    <div>
                      <label className="block mb-1 font-semibold text-xs text-muted">Transaction ID / Ref *</label>
                      <input
                        type="text"
                        required={paymentMethod === "BKASH" || paymentMethod === "BANK"}
                        value={transactionId}
                        onChange={e => setTransactionId(e.target.value)}
                        placeholder="e.g. TRX12345"
                        className="w-full border border-black/15 p-2.5 rounded-lg text-sm bg-white text-ink outline-none focus:border-brand font-mono uppercase"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-xs text-muted">Order Notes (Optional)</label>
                  <textarea
                    value={orderNotes}
                    onChange={e => setOrderNotes(e.target.value)}
                    placeholder="Notes from customer phone call / FB page message..."
                    rows={2}
                    className="w-full border border-black/15 p-2.5 rounded-lg text-sm bg-white text-ink outline-none focus:border-brand"
                  ></textarea>
                </div>

                {/* Calculation Summary Box */}
                <div className="bg-white p-4 rounded-xl border border-black/10 space-y-2 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Shipping Fee ({shippingCity}):</span>
                    <span className="font-semibold text-ink">{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t pt-2 text-ink">
                    <span>Grand Total:</span>
                    <span className="text-brand">{formatPrice(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t pt-2 text-ink">
                    <span>Due Amount:</span>
                    <span className={dueAmount > 0 ? "text-orange-600 font-bold" : "text-green-600"}>
                      {formatPrice(dueAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-3 border border-black/20 rounded font-bold text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand text-white font-bold px-8 py-3 rounded text-sm transition hover:opacity-95 shadow-sm"
                >
                  Create Order & Deduct Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Customer Modal */}
      {isNewCustModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
              <h3 className="text-lg font-bold text-ink">Add New Customer</h3>
              <button onClick={() => setIsNewCustModalOpen(false)} className="text-gray-400 hover:text-ink font-bold text-xl">✕</button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={e => setNewCustName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full border border-black/15 p-2.5 rounded text-sm outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newCustEmail}
                  onChange={e => setNewCustEmail(e.target.value)}
                  placeholder="e.g. tanvir@example.com"
                  className="w-full border border-black/15 p-2.5 rounded text-sm outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={e => setNewCustPhone(e.target.value)}
                  placeholder="e.g. 01811223344"
                  className="w-full border border-black/15 p-2.5 rounded text-sm outline-none focus:border-brand"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewCustModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand text-white rounded text-sm font-bold hover:opacity-95 transition shadow-sm"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <p className="font-semibold">{selectedOrder.status} | {selectedOrder.paymentStatus} ({selectedOrder.paymentMethod})</p>
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
                      <p className="text-xs text-ink/60">Size: {item.size} | Qty: {item.quantity} | Price: ৳{Number(item.price).toLocaleString()}</p>
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
