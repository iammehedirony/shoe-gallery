import { Suspense } from "react";
import CategoryPageClient from "./CategoryPageClient";

async function CategoryPageContent({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];
  return <CategoryPageClient slug={slug} currentSlug={currentSlug} />;
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  return (
    <Suspense fallback={
      <main className="container mx-auto px-4 py-12 max-w-[1240px]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </main>
    }>
      <CategoryPageContent params={params} />
    </Suspense>
  );
}
