import CategoryPageClient from "./CategoryPageClient";

export async function generateStaticParams() {
  return [
    { id: 'mens-boot' },
    { id: 'ladies-collection' },
    { id: 'mens-collection' },
  ];
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CategoryPageClient id={id} />;
}
