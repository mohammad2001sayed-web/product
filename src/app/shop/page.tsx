import { Suspense } from "react";
import { ProductCatalog, ProductCatalogSkeleton } from "@/src/components/ProductCatalog/ProductCatalog";

type ShopPageProps = {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
};

export default function ShopPage({ searchParams }: ShopPageProps) {
  return (
    <main className="flex-1 bg-[#f8f9ff]">
      <Suspense fallback={<ProductCatalogSkeleton />}>
        <ShopContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function ShopContent({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = params.page && /^[1-9]\d*$/.test(params.page) && Number.isSafeInteger(Number(params.page))
    ? Number(params.page)
    : 1;
  const category = params.category && /^[a-f\d]{24}$/i.test(params.category) ? params.category.toLowerCase() : undefined;
  const keyword = params.q?.trim().slice(0, 100) || undefined;

  return <ProductCatalog title="Shop All Products" page={page} category={category} keyword={keyword} />;
}
