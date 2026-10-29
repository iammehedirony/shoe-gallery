"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/src/store/cartStore";
import { useAuthStore } from "@/src/store/authStore";
import { authService } from "@/src/lib/services/auth.service";
import { useToast } from "@/src/contexts/ToastContext";
import { formatPrice } from "@/src/lib/format";
import { apiClient } from "@/src/lib/api/api.client";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const { showToast } = useToast();

  const [shippingCity, setShippingCity] = useState("Dhaka");
  const shippingFee = shippingCity.trim().toLowerCase() === "dhaka" ? 60 : 120;

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    customerPhone: user?.phone || "",
    shippingAddress: "",
    orderNotes: "",
    paymentMethod: "COD",
    transactionId: "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const { data: addressesResponse } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: authService.getAddresses,
    enabled: !!token,
  });

  const savedAddresses = addressesResponse?.data || addressesResponse || [];

  const handleSavedAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const addressId = e.target.value;
    setSelectedAddressId(addressId);
    if (!addressId) return;

    const addr = savedAddresses.find((a: any) => a.id === addressId);
    if (addr) {
      setFormData((prev) => ({
        ...prev,
        customerName: addr.fullName,
        customerPhone: addr.phone,
        shippingAddress: addr.street,
      }));
      if (addr.city) {
        setShippingCity(addr.city);
      }
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = subtotal + shippingFee;

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShippingCity(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!formData.customerName || !formData.customerPhone || !formData.shippingAddress || !shippingCity) {
      setError("Please fill in all required billing and shipping fields");
      return;
    }

    if ((formData.paymentMethod === "BKASH" || formData.paymentMethod === "BANK") && !formData.transactionId.trim()) {
      setError(`Please enter the ${formData.paymentMethod === "BKASH" ? "bKash Transaction ID (TrxID)" : "Bank Reference / Transaction ID"}`);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        shippingCity,
        shippingAddress: formData.shippingAddress,
        orderNotes: formData.orderNotes,
        paymentMethod: formData.paymentMethod,
        transactionId: (formData.paymentMethod === "BKASH" || formData.paymentMethod === "BANK") ? formData.transactionId : undefined,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          size: item.selectedSize,
          quantity: item.quantity,
        })),
      };

      const res: any = await apiClient.post("/orders/checkout", payload);

      // If user is logged in, check if this address is already saved; if not, save it automatically
      if (token && formData.shippingAddress) {
        const addressExists = savedAddresses.some(
          (a: any) => a.street.toLowerCase() === formData.shippingAddress.toLowerCase() && a.city.toLowerCase() === shippingCity.toLowerCase()
        );
        if (!addressExists) {
          try {
            await authService.addAddress({
              fullName: formData.customerName,
              phone: formData.customerPhone,
              street: formData.shippingAddress,
              city: shippingCity,
              district: shippingCity,
              country: "Bangladesh",
              isDefault: savedAddresses.length === 0,
            });
          } catch (addrErr) {
            console.error("Failed to auto-save address", addrErr);
          }
        }
      }

      setIsSuccess(true);
      await clearCart();
      const order = res?.data || res;
      showToast("Order placed successfully!");
      router.push(`/order-success?orderNumber=${order?.orderNumber || "Confirmed"}`);
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSuccess) {
    return (
      <main className="container mx-auto px-4 py-16 text-center max-w-xl">
        <h1 className="text-2xl font-bold text-ink mb-4">Your Cart is Empty</h1>
        <p className="text-muted mb-6">Add products to your cart before proceeding to checkout.</p>
        <button
          onClick={() => router.push("/shop")}
          className="bg-brand text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition"
        >
          Go to Shop
        </button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-[1240px]">
      <div className="flex gap-4 mb-12 font-bold text-sm sm:text-base text-ink/40">
        <Link href="/cart" className="hover:text-ink">SHOPPING CART</Link>
        <span>{">"}</span>
        <span className="text-ink">CHECKOUT DETAILS</span>
        <span>{">"}</span>
        <span>ORDER COMPLETE</span>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left: Billing & Shipping */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-ink">Billing & Shipping Information</h2>
            {token && savedAddresses.length > 0 && (
              <div className="w-64">
                <select
                  value={selectedAddressId}
                  onChange={handleSavedAddressSelect}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-brand bg-white font-medium"
                >
                  <option value="">📌 Select Saved Address...</option>
                  {savedAddresses.map((addr: any) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.fullName} ({addr.street}, {addr.city})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="space-y-4 bg-white p-6 rounded-2xl border border-black/5 shadow-xs">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Full Name *</label>
              <input
                type="text"
                name="customerName"
                required
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Your Full Name"
                className="w-full border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1">Phone Number *</label>
              <input
                type="text"
                name="customerPhone"
                required
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="017xxxxxxxx"
                className="w-full border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">City / Delivery Area *</label>
                <select
                  value={shippingCity}
                  onChange={handleCityChange}
                  className="w-full border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-brand bg-white"
                >
                  <option value="Dhaka">Dhaka (60৳ Delivery)</option>
                  <option value="Outside Dhaka">Outside Dhaka (120৳ Delivery)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Country</label>
                <input
                  type="text"
                  value="Bangladesh"
                  disabled
                  className="w-full border border-gray-200 rounded-xl p-3.5 text-sm bg-gray-50 text-muted"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1">Street Address / House / Area *</label>
              <input
                type="text"
                name="shippingAddress"
                required
                value={formData.shippingAddress}
                onChange={handleChange}
                placeholder="House no, Road no, Area, Thana"
                className="w-full border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1">Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                {[
                  { id: "COD", label: "Cash on Delivery" },
                  { id: "BKASH", label: "bKash Payment" },
                  { id: "BANK", label: "Bank Transfer" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-center p-3.5 rounded-xl border text-sm font-bold cursor-pointer transition ${
                      formData.paymentMethod === method.id
                        ? "border-brand bg-brand/5 text-brand"
                        : "border-gray-200 text-ink hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={formData.paymentMethod === method.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {method.label}
                  </label>
                ))}
              </div>

              {formData.paymentMethod === "BKASH" && (
                <div className="p-5 rounded-2xl bg-white border border-black/15 shadow-xs space-y-4 mt-3">
                  <div className="text-xs text-ink/80 font-medium leading-relaxed">
                    <p className="font-bold text-ink mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand"></span>
                      bKash Merchant / Personal Number:
                    </p>
                    <div className="font-mono text-sm font-bold bg-gray-50 px-3.5 py-2 rounded-xl border border-black/10 text-brand w-fit">
                      01712-345678 (Personal / Send Money)
                    </div>
                    <p className="mt-2.5 text-muted">
                      Please send <span className="font-bold text-ink">{formatPrice(totalAmount)}</span> to this bKash number using 'Send Money', then enter your Transaction ID (TrxID) below.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">Transaction ID (TrxID) *</label>
                    <input
                      type="text"
                      name="transactionId"
                      required={formData.paymentMethod === "BKASH"}
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="e.g. 9H74K82L1M"
                      className="w-full border border-black/20 rounded-xl p-3 text-sm font-mono bg-white focus:outline-none focus:border-brand text-ink uppercase"
                    />
                  </div>
                </div>
              )}

              {formData.paymentMethod === "BANK" && (
                <div className="p-5 rounded-2xl bg-white border border-black/15 shadow-xs space-y-4 mt-3">
                  <div className="text-xs text-ink/80 font-medium leading-relaxed">
                    <p className="font-bold text-ink mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand"></span>
                      Bank Account Information:
                    </p>
                    <div className="bg-gray-50 p-3.5 rounded-xl border border-black/10 space-y-1 font-mono text-xs text-ink/90">
                      <p><span className="font-semibold text-muted">Bank Name:</span> Eastern Bank PLC (EBL)</p>
                      <p><span className="font-semibold text-muted">Account Name:</span> JH Shoe Gallery</p>
                      <p><span className="font-semibold text-muted">Account Number:</span> 1234-5020-0012-3456</p>
                      <p><span className="font-semibold text-muted">Branch:</span> Gulshan Corporate Branch</p>
                      <p><span className="font-semibold text-muted">Routing Number:</span> 058261234</p>
                    </div>
                    <p className="mt-2.5 text-muted">
                      Please transfer <span className="font-bold text-ink">{formatPrice(totalAmount)}</span> to the bank account above, then enter your Bank Reference / Deposit Slip No. / Transaction ID below.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">Bank Reference / Transaction ID *</label>
                    <input
                      type="text"
                      name="transactionId"
                      required={formData.paymentMethod === "BANK"}
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="e.g. EBL-TRX-987654"
                      className="w-full border border-black/20 rounded-xl p-3 text-sm font-mono bg-white focus:outline-none focus:border-brand text-ink uppercase"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1">Order Notes (Optional)</label>
              <textarea
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleChange}
                placeholder="Notes about your order, e.g. special delivery instructions"
                rows={3}
                className="w-full border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-brand"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-black/10 rounded-2xl p-6 bg-white shadow-xs sticky top-8">
            <h2 className="text-xl font-bold mb-6 text-ink">YOUR ORDER ({items.length})</h2>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between pt-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden relative border flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill sizes="48px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink line-clamp-1">{item.title}</p>
                      <p className="text-xs text-muted">Size: {item.selectedSize} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-ink">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping ({shippingCity})</span>
                <span className="font-semibold text-ink">{formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-4 text-ink">
                <span>Total Amount</span>
                <span className="text-brand">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 bg-brand hover:bg-brand-dark text-white py-4 font-bold rounded-xl transition shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Placing Order..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
