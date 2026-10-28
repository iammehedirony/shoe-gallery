"use client";

import ProductCard from "@/src/components/product/ProductCard";
import ProductCardSkeleton from "@/src/components/product/ProductCardSkeleton";
import { ChevronRightIcon } from "@/src/components/ui/Icons";
import { useProducts } from "@/src/hooks/queries/useProducts";

interface TagProductSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  category?: string;
  showShopAll?: boolean;
  shopHref?: string;
}

export default function TagProductSection({
  id,
  title,
  subtitle,
  tag,
  category,
  showShopAll = false,
  shopHref = "#",
}: TagProductSectionProps) {
  const { data, isLoading } = useProducts({ tag, category });

  const products = data?.products || data?.data?.products || (Array.isArray(data) ? data : []);

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-6">
        <div className="mb-6 text-center sm:mb-8">
          <h2
            id={`${id}-heading`}
            className="text-[15px] font-extrabold uppercase tracking-[0.16em] text-brand sm:text-lg lg:text-xl"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.22em] text-muted sm:text-[10px] sm:tracking-[0.28em]">
              {subtitle}
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:gap-5">
            {products.map((product: any) => {
              const formattedProduct = {
                id: product.id || product._id,
                slug: product.slug,
                title: product.title,
                image: product.image || product.images?.[0] || "/logo.png",
                price: Number(product.price),
                oldPrice: product.oldPrice ? Number(product.oldPrice) : Number(product.price),
                discount: product.discount || 0,
                sizes: product.variants?.map((v: any) => v.size) || ["39", "40", "41", "42"],
                badge: product.badge,
              };
              return <ProductCard key={product.id || product._id} product={formattedProduct} />;
            })}
          </div>
        )}

        {showShopAll ? (
          <div className="mt-8 flex justify-center sm:mt-10">
            <a
              href={shopHref}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-brand px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand transition-colors hover:bg-brand hover:text-white sm:text-[11px]"
            >
              Shop All
              <ChevronRightIcon className="h-3 w-3" />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
