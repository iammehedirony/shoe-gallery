import Footer from "@/src/components/layout/Footer";
import Header from "@/src/components/layout/Header";
import HeroSlider from "@/src/components/home/HeroSlider";
import ProductSection from "@/src/components/home/ProductSection";
import PromoBannerGrid from "@/src/components/home/PromoBannerGrid";
import ScrollToTop from "@/src/components/ui/ScrollToTop";
import {
  bestSellingProducts,
  ladiesCollectionProducts,
  mensCollectionProducts,
  mensLoaferProducts,
  newArrivalProducts,
} from "@/src/data/mockProducts";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1">
        <h1 className="sr-only">
          RICHKID Bangladesh — premium shoes, sneakers and accessories
        </h1>

        <HeroSlider />
        <PromoBannerGrid />

        <ProductSection
          id="new-arrival"
          title="New Arrival"
          products={newArrivalProducts}
        />

        <ProductSection
          id="best-selling"
          title="Best Selling"
          subtitle="Best selling products just for you"
          products={bestSellingProducts}
          showShopAll
        />

        <ProductSection
          id="mens-collection"
          title="Men's Collection"
          products={mensCollectionProducts}
          showShopAll
        />

        <ProductSection
          id="mens-loafer"
          title="Men's Loafer & Formal"
          products={mensLoaferProducts}
          showShopAll
        />

        <ProductSection
          id="ladies-collection"
          title="Ladies Collection"
          products={ladiesCollectionProducts}
          showShopAll
        />
      </main>
      <ScrollToTop />
    </div>
  );
}
