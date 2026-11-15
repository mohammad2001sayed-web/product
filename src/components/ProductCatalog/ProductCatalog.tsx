import { io } from "next/cache";
import { cookies } from "next/headers";
import { getProducts, getProductsByBrand } from "@/src/app/(home)/home.service";
import { getWishlist } from "@/src/app/wishlist/wishlist.api";
import type { Product } from "@/src/app/(home)/home.interface";
import { FeaturedProducts } from "@/src/components/FeaturedProducts/FeaturedProducts";

type ProductCatalogProps = {
  title?: string;
  brandId?: string;
};

export async function ProductCatalog({ title, brandId }: ProductCatalogProps) {
  await io();

  const resolvedTitle = title ?? (brandId ? "Brand Products" : "All Products");
  let products: Product[] | null = null;
  let favoriteIds: string[] = [];

  try {
    products = brandId ? await getProductsByBrand(brandId) : await getProducts();
  } catch (error) {
    console.error("Unable to load products from the API.", error);
  }

  if ((await cookies()).has("token")) {
    try {
      const wishlist = await getWishlist();
      favoriteIds = (wishlist.data ?? []).map((product) => product.id || product._id);
    } catch {
      favoriteIds = [];
    }
  }

  if (products === null) {
    return (
      <section className="mx-auto w-full max-w-360 px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="products-error-title">
        <h1 id="products-error-title" className="text-2xl font-bold text-[#121c2a]">{resolvedTitle}</h1>
        <p role="alert" className="mt-3 rounded-lg border border-[#f1c6c6] bg-white p-5 text-sm text-[#7f1d1d]">
          Products could not be loaded right now. Please try again in a moment.
        </p>
      </section>
    );
  }

  return (
    <FeaturedProducts
      products={products}
      favoriteIds={favoriteIds}
      title={resolvedTitle}
      description={
        brandId
          ? `Explore ${products.length} ${products.length === 1 ? "product" : "products"} from this brand.`
          : `Browse all ${products.length} products in the FreshCart catalog.`
      }
    />
  );
}

export function ProductCatalogSkeleton() {
  return (
    <section aria-label="Loading products" className="mx-auto w-full max-w-360 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-9 w-52 animate-pulse rounded bg-[#e6eeff]" />
      <div className="grid grid-cols-1 gap-3.5 min-[360px]:grid-cols-2 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="animate-pulse rounded-lg border border-[#e6eeff] bg-white p-3.5 sm:p-4">
            <div className="aspect-square rounded-lg bg-[#eff4ff]" />
            <div className="mt-4 h-3 w-1/2 rounded bg-[#e6eeff]" />
            <div className="mt-2 h-5 w-full rounded bg-[#e6eeff]" />
            <div className="mt-2 h-4 w-2/3 rounded bg-[#e6eeff]" />
            <div className="mt-5 h-10 w-full rounded-lg bg-[#e6eeff]" />
          </div>
        ))}
      </div>
    </section>
  );
}
