import { Suspense } from "react";
import { ProductCatalog, ProductCatalogSkeleton } from "@/src/components/ProductCatalog/ProductCatalog";

export default function HomePage() {
  return (
    <main className="flex-1 bg-[#f8f9ff]">
      <Suspense fallback={<ProductCatalogSkeleton />}>
        <ProductCatalog preview />
      </Suspense>
    </main>
  );
}
