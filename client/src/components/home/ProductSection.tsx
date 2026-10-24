import ProductCard from "@/src/components/product/ProductCard";
import { ChevronRightIcon } from "@/src/components/ui/Icons";
import type { Product } from "@/src/types/product";

interface ProductSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  products: Product[];
  showShopAll?: boolean;
  shopHref?: string;
}

export default function ProductSection({
  id,
  title,
  subtitle,
  products,
  showShopAll = false,
  shopHref = "#",
}: ProductSectionProps) {
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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
