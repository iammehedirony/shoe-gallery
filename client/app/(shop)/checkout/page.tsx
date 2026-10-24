"use client";

import { useState } from "react";
import Image from "next/image";

export default function CheckoutPage() {
  const [shipping, setShipping] = useState(60);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left: Cart & Billing */}
        <div className="lg:col-span-2">
          {/* Cart Items (Simplified for prototype) */}
          <div className="mb-8 border-b border-black/10 pb-8">
            <div className="grid grid-cols-4 gap-4 text-sm font-bold uppercase mb-4">
              <span>Product</span> <span>Price</span> <span>Quantity</span> <span>Subtotal</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-100 rounded"></div>
              <p className="flex-1">Graceland Super Durable Slip-On Shoes Full Black - Size/38</p>
              <span>1750৳</span>
              <div className="border rounded px-2">1</div>
              <span>1750৳</span>
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
            <div className="flex justify-between text-sm mb-4"><span>Shoes x 1</span> <span>1750৳</span></div>
            <div className="flex justify-between font-bold mb-4"><span>Subtotal</span> <span>1750৳</span></div>
            
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
              <span>Total</span> <span>{1750 + shipping}৳</span>
            </div>
            <button className="w-full mt-6 bg-brand text-white py-4 font-bold rounded">PLACE ORDER</button>
          </div>
        </div>
      </div>
    </main>
  );
}
