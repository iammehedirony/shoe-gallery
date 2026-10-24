"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/src/lib/format";

export default function CheckoutPage() {
  const [shipping, setShipping] = useState(60);
  const [quantity, setQuantity] = useState(1);
  const price = 1750;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const subtotal = price * quantity;

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left: Cart & Billing */}
        <div className="lg:col-span-2">
          {/* Cart Items Table */}
          <div className="mb-8">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-8 text-sm font-bold uppercase mb-4 text-ink border-b border-black/10 pb-4 items-center">
              <span>PRODUCT</span> <span className="text-center">PRICE</span> <span className="text-center">QUANTITY</span> <span className="text-right">SUBTOTAL</span>
            </div>
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-8 items-center py-4 border-b border-black/10">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <Image src="/images/products/06.jpg" alt="Product" width={64} height={64} className="object-cover h-full w-full" />
                </div>
                <p className="text-sm">Graceland Super Durable Slip-On Shoes Full Black - Size/38</p>
              </div>
              <span className="text-sm text-center">{formatPrice(price)}</span>
              <div className="flex items-center border border-black/20 rounded px-2 py-1 text-center justify-center">
                <button onClick={handleDecrement} className="px-2">-</button>
                <span className="px-3 font-semibold">{quantity}</span>
                <button onClick={handleIncrement} className="px-2">+</button>
              </div>
              <span className="text-sm font-bold text-right">{formatPrice(subtotal)}</span>
            </div>
          </div>

          {/* Billing Form */}
          <h2 className="text-xl font-bold mb-6">BILLING & SHIPPING</h2>
          <form className="grid gap-4">
            <input type="text" placeholder="Full Name *" className="border p-3 rounded" />
            <input type="text" placeholder="Phone *" className="border p-3 rounded" />
            <input type="text" placeholder="Address *" className="border p-3 rounded" />
            <select className="border p-3 rounded"><option>Dhaka</option></select>
            <input type="text" value="Bangladesh" disabled className="border p-3 rounded bg-gray-50" />
            <textarea placeholder="Order Notes (optional)" className="border p-3 rounded h-32"></textarea>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="border-2 border-brand rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">YOUR ORDER</h2>
            <div className="flex justify-between font-bold mb-2"><span>Product</span> <span>Subtotal</span></div>
            <div className="flex justify-between text-sm mb-4"><span>Shoes x {quantity}</span> <span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between font-bold mb-4"><span>Subtotal</span> <span>{formatPrice(subtotal)}</span></div>
            
            <div className="mb-4">
              <label className="flex items-center gap-2 mb-2">
                <input type="radio" name="shipping" checked={shipping === 60} onChange={() => setShipping(60)} />
                Inside Dhaka City: 60৳
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping" checked={shipping === 100} onChange={() => setShipping(100)} />
                Outside Dhaka City: 100৳
              </label>
            </div>
            
            <div className="flex justify-between text-lg font-bold border-t pt-4">
              <span>Total</span> <span>{formatPrice(subtotal + shipping)}</span>
            </div>
            <button className="w-full mt-6 bg-brand text-white py-4 font-bold rounded">PLACE ORDER</button>
          </div>
        </div>
      </div>
    </main>
  );
}
