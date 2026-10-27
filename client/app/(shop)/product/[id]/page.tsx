import { Suspense } from "react";
import ProductDetailsClient from "@/src/components/product/ProductDetailsClient";

function ProductDetailsLoading() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-[1240px]">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </main>
  );
}

async function ProductContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailsClient productId={id} />;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ProductDetailsLoading />}>
      <ProductContent params={params} />
    </Suspense>
  );
}
