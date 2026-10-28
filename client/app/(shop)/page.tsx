"use client";

import HeroSlider from "@/src/components/home/HeroSlider";
import PromoBannerGrid from "@/src/components/home/PromoBannerGrid";
import TagProductSection from "@/src/components/home/TagProductSection";
import ProductCardSkeleton from "@/src/components/product/ProductCardSkeleton";
import ScrollToTop from "@/src/components/ui/ScrollToTop";
import { useTags } from "@/src/hooks/queries/useTags";

export default function Home() {
  const { data: tags = [], isLoading: isLoadingTags } = useTags();

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1">
        <h1 className="sr-only">
          JH Shoe Gallery Bangladesh — premium shoes, sneakers and accessories
        </h1>

        <HeroSlider />
        <PromoBannerGrid />

        {isLoadingTags ? (
          <div className="space-y-12">
            {[1, 2].map((sectionIndex) => (
              <div key={sectionIndex} className="py-8 sm:py-10 lg:py-12">
                <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-6">
                  <div className="mb-6 flex flex-col items-center justify-center sm:mb-8 space-y-2">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:gap-5">
                    {[1, 2, 3, 4].map((i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tags.length === 0 ? (
          <div className="py-16 text-center text-sm text-ink/50 italic bg-white p-12 my-8 rounded-lg border max-w-[1240px] mx-auto">
            No tags created yet. Add tags in the Admin Panel (&quot;Tags & Badges&quot;) to dynamically populate homepage sections.
          </div>
        ) : (
          tags.map((tag: any, index: number) => (
            <TagProductSection
              key={tag.id || tag._id}
              id={`tag-section-${tag.slug}`}
              title={tag.name}
              subtitle={`Explore our collection of ${tag.name}`}
              tag={tag.slug}
              showShopAll={index % 2 === 1}
              shopHref="/shop"
            />
          ))
        )}
      </main>
      <ScrollToTop />
    </div>
  );
}
