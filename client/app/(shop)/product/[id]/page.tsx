import { notFound } from "next/navigation";
import {
  newArrivalProducts,
  bestSellingProducts,
  mensCollectionProducts,
  mensLoaferProducts,
  ladiesCollectionProducts
} from "@/src/data/mockProducts";
import ProductDetailsClient from "@/src/components/product/ProductDetailsClient";

const allProducts = [
  ...newArrivalProducts,
  ...bestSellingProducts,
  ...mensCollectionProducts,
  ...mensLoaferProducts,
  ...ladiesCollectionProducts,
];

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
