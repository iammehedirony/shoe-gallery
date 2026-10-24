"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      title: "Graceland Super Durable Slip-On Shoes Full Black",
      price: 1750,
      oldPrice: 3150,
      size: "38",
      image: "/images/products/06.jpg",
      quantity: 1,
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 60; // Hardcoded for this example
  const total = subtotal + shipping;

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Breadcrumb-like Steps */}
      <div className="flex gap-4 mb-12 font-bold text-lg text-ink/40">
        <span className="text-ink">SHOPPING CART</span>
        <span>{">"}</span>
        <span>CHECKOUT DETAILS</span>
        <span>{">"}</span>
        <span>ORDER COMPLETE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 text-sm font-bold uppercase mb-4 text-ink/70">
            <span>Product</span>
            <span className="text-right">Total</span>
          </div>
          
          <div className="border-t border-black/10 pt-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-6 items-start">
                <div className="h-24 w-24 bg-gray-100 rounded overflow-hidden">
                  <Image src={item.image} alt={item.title} width={96} height={96} className="object-cover h-full w-full" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="text-sm text-ink/60 line-through">{item.oldPrice}৳</p>
                  <p className="text-sm font-semibold text-brand">{item.price}৳</p>
                  <p className="text-sm text-ink/80">Select Size ↓: Size/{item.size}</p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-black/20 rounded">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button className="text-ink/50 hover:text-red-500">🗑️</button>
                  </div>
                </div>
                <div className="text-right font-bold text-ink">
                    <p>{item.price * item.quantity}৳</p>
                    <p className="text-xs font-normal text-brand mt-1">Save {(item.oldPrice - item.price) * item.quantity}৳</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cart Totals */}
        <div className="lg:col-span-1">
          <div className="border border-black/10 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">CART TOTALS</h2>
            <div className="flex justify-between py-4 border-b border-black/10">
              <span className="text-ink/80">Subtotal</span>
              <span className="font-bold">{subtotal}৳</span>
            </div>
            <div className="flex justify-between py-4 border-b border-black/10">
              <div>
                <p className="text-ink/80">Shipping</p>
                <p className="text-xs text-ink/60 mt-1">Inside Dhaka City</p>
              </div>
              <span className="font-bold">{shipping}৳</span>
            </div>
            <div className="flex justify-between py-6 text-xl font-bold">
              <span>Estimated total</span>
              <span>{total}৳</span>
            </div>
            <Link href="/checkout" className="block w-full text-center bg-ink text-white py-4 font-bold rounded hover:bg-ink/90">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
