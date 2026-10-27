"use client";

import { useEffect, useState } from "react";
import HeroSlider from "@/src/components/home/HeroSlider";
import PromoBannerGrid from "@/src/components/home/PromoBannerGrid";
import TagProductSection from "@/src/components/home/TagProductSection";
import ScrollToTop from "@/src/components/ui/ScrollToTop";
import { productService } from "@/src/lib/services/product.service";

export default function Home() {
  const [tags, setTags] = useState<any[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const data = await productService.getTags();
        setTags(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load tags for homepage", err);
      } finally {
        setIsLoadingTags(false);
      }
    }
    fetchTags();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1">
        <h1 className="sr-only">
          JH Shoe Gallery Bangladesh — premium shoes, sneakers and accessories
        </h1>

        <HeroSlider />
        <PromoBannerGrid />

        {isLoadingTags ? (
          <div className="py-16 text-center text-sm text-ink/50">Loading product sections...</div>
        ) : tags.length === 0 ? (
          <div className="py-16 text-center text-sm text-ink/50 italic bg-white p-12 my-8 rounded-lg border max-w-[1240px] mx-auto">
            No tags created yet. Add tags in the Admin Panel (&quot;Tags & Badges&quot;) to dynamically populate homepage sections.
          </div>
        ) : (
          tags.map((tag, index) => (
            <TagProductSection
              key={tag.id}
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
