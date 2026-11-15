import { Suspense } from "react";
import { ProductCatalog, ProductCatalogSkeleton } from "@/src/components/ProductCatalog/ProductCatalog";
import { getBrands } from "@/src/app/brands/brands.api";

type BrandProductsPageProps = {
  params: Promise<{ brandId: string }>;
};

async function BrandProductsRoute({
  params,
}: BrandProductsPageProps) {
  const { brandId } = await params;

  return <BrandProductsContent brandId={brandId} />;
}

// ✅ كل الـ fetch جوّه component منفصل داخل Suspense
async function BrandProductsContent({ brandId }: { brandId: string }) {
  const brandsResult = await getBrands().catch(() => null);
  const brand = brandsResult?.data.find((b) => b._id === brandId);
  const brandName = brand?.name ?? "Brand";

  return (
    <ProductCatalog
      brandId={brandId}
      title={`${brandName} Products`}
    />
  );
}

export default function BrandProductsPage({ params }: BrandProductsPageProps) {
  return (
    <main className="flex-1 bg-[#f8f9ff]">
      <Suspense fallback={<ProductCatalogSkeleton />}>
        <BrandProductsRoute params={params} />
      </Suspense>
    </main>
  );
}
