import { getBrands } from "@/src/app/brands/brands.api";
import { BrandsCatalog } from "@/src/components/BrandsCatalog/BrandsCatalog";

export async function BrandsDataSection() {
  const brandsResult = await getBrands().catch(() => null);

  return (
    <BrandsCatalog
      brands={brandsResult?.data ?? []}
      loadError={!brandsResult}
    />
  );
}
