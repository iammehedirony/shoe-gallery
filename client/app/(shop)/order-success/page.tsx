"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "Confirmed";

  return (
    <main className="container mx-auto px-4 py-16 max-w-xl text-center">
      <div className="bg-white rounded-2xl border border-black/5 p-8 shadow-sm">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-ink mb-2">Order Placed Successfully!</h1>
        <p className="text-muted mb-6">
          Thank you for shopping with JH Shoe Gallery. Your order <span className="font-semibold text-ink">#{orderNumber}</span> has been received and is being processed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t">
          <Link
            href="/account"
            className="px-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition shadow-sm"
          >
            View Orders
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 border border-gray-300 text-ink font-bold rounded-xl hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Loading order confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
