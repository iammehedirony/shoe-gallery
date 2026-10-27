"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { useAuthStore } from "@/src/store/authStore";
import { formatPrice } from "@/src/lib/format";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, fetchBackendCart } = useCartStore();
  const { token } = useAuthStore();
  const [shipping, setShipping] = useState(60);

  useEffect(() => {
    if (token) {
      fetchBackendCart();
    }
  }, [token, fetchBackendCart]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + (items.length > 0 ? shipping : 0);

  const handleProceedToCheckout = () => {
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!activeToken) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-[1240px]">
      {/* Breadcrumb-like Steps */}
      <div className="flex gap-4 mb-12 font-bold text-sm sm:text-base text-ink/40">
        <span className="text-ink">SHOPPING CART</span>
        <span>{">"}</span>
        <span>CHECKOUT DETAILS</span>
        <span>{">"}</span>
        <span>ORDER COMPLETE</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-black/5 shadow-sm">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-ink mb-2">Your cart is empty</h2>
          <p className="text-muted mb-6">Discover our latest footwear collection and add items to your cart.</p>
          <Link
            href="/shop"
            className="inline-block bg-brand text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 text-sm font-bold uppercase mb-4 text-ink/75">
              <span>Product</span>
              <span className="text-right">Total</span>
            </div>
            
            <div className="border-t border-black/10 divide-y divide-black/10 pt-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5 items-start py-6">
                  <div className="h-24 w-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative border">
                    <Image src={item.image} alt={item.title} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-ink mb-1">{item.title}</h3>
                    {item.oldPrice && item.oldPrice > item.price && (
                      <p className="text-sm text-muted line-through">{formatPrice(item.oldPrice)}</p>
                    )}
                    <p className="text-sm font-bold text-brand mb-1">{formatPrice(item.price)}</p>
                    <p className="text-xs text-ink/70 font-medium mb-3">Size: {item.selectedSize}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-black/20 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100 text-ink font-bold transition"
                        >
                          -
                        </button>
                        <span className="px-4 font-semibold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100 text-ink font-bold transition"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-muted hover:text-red-600 text-sm font-medium transition flex items-center gap-1"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-bold text-ink">
                    <p className="text-base">{formatPrice(item.price * item.quantity)}</p>
                    {item.oldPrice && item.oldPrice > item.price && (
                      <p className="text-xs font-normal text-brand mt-1">
                        Save {formatPrice((item.oldPrice - item.price) * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Cart Totals */}
          <div className="lg:col-span-1">
            <div className="border border-black/10 rounded-2xl p-6 bg-white shadow-xs">
              <h2 className="text-xl font-bold mb-6 text-ink">CART TOTALS</h2>
              <div className="flex justify-between py-4 border-b border-black/10 text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-bold text-ink">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between py-4 border-b border-black/10 text-sm">
                <div>
                  <p className="text-muted">Shipping</p>
                  <p className="text-xs text-ink/50 mt-0.5">Standard Delivery</p>
                </div>
                <span className="font-bold text-ink">{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between py-6 text-lg font-bold text-ink">
                <span>Estimated Total</span>
                <span className="text-brand">{formatPrice(total)}</span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="block w-full text-center bg-ink text-white py-4 font-bold rounded-xl hover:bg-ink/90 transition shadow-sm"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
