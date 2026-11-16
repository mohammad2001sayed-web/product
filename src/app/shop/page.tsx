import { Suspense } from "react";
import { ProductCatalog, ProductCatalogSkeleton } from "@/src/components/ProductCatalog/ProductCatalog";

type ShopPageProps = {
  searchParams: Promise<{ page?: string }>;
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
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;

  return <ProductCatalog title="Shop All Products" page={page} />;
}
