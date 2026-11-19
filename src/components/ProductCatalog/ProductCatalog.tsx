import { io } from "next/cache";
import Link from "next/link";
import { getAuthToken } from "@/src/next-Auth/getAuthToken";
import { getProductsByBrand, getProductsPage } from "@/src/app/(home)/home.service";
import { getWishlist } from "@/src/app/wishlist/wishlist.api";
import type { Product } from "@/src/app/(home)/home.interface";
import { FeaturedProducts } from "@/src/components/FeaturedProducts/FeaturedProducts";

type ProductCatalogProps = {
  title?: string;
  brandId?: string;
  page?: number;
  preview?: boolean;
  category?: string;
  keyword?: string;
};

export async function ProductCatalog({ title, brandId, page = 1, preview = false, category, keyword }: ProductCatalogProps) {
  await io();

  const resolvedTitle = title ?? (brandId ? "Brand Products" : preview ? "Popular Products" : "All Products");
  let products: Product[] | null = null;
  let favoriteIds: string[] = [];
  let currentPage = page;
  let pageCount = 1;

  try {
    if (brandId) {
      products = await getProductsByBrand(brandId);
    } else {
      const result = await getProductsPage(page, category, keyword);
      products = result.data;
      pageCount = Math.max(1, result.metadata?.numberOfPages ?? 1);

      if (page > pageCount && !keyword) {
        currentPage = pageCount;
        products = (await getProductsPage(pageCount, category)).data;
      } else if (keyword) {
        currentPage = result.metadata?.currentPage ?? 1;
      }
    }
  } catch (error) {
    console.error("Unable to load products from the API.", error);
  }

  if (await getAuthToken()) {
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

  const paginationHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (keyword) params.set("q", keyword);
    params.set("page", String(targetPage));
    return `/shop?${params.toString()}`;
  };

  return (
    <>
      <FeaturedProducts
        products={products}
        favoriteIds={favoriteIds}
        title={resolvedTitle}
        description={
          brandId
            ? `Explore ${products.length} ${products.length === 1 ? "product" : "products"} from this brand.`
            : preview
              ? "A quick selection from the FreshCart catalog."
              : `Page ${currentPage} of ${pageCount} in the FreshCart catalog.`
        }
      />
      {preview ? (
        <div className="mx-auto -mt-7 w-full max-w-360 px-4 pb-10 text-center sm:px-6 lg:px-8">
          <Link href="/shop" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#16a34a] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#15803d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2">
            View all products
          </Link>
        </div>
      ) : !brandId && pageCount > 1 ? (
        <nav aria-label="Product pages" className="mx-auto flex w-full max-w-360 items-center justify-center gap-5 px-4 pb-12 sm:px-6 lg:px-8">
          {currentPage > 1 ? (
            <Link href={paginationHref(currentPage - 1)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#16a34a] hover:text-[#15803d]">
              Previous
            </Link>
          ) : (
            <span aria-disabled="true" className="rounded-lg border border-slate-100 px-4 py-2 text-sm text-slate-400">Previous</span>
          )}
          <span className="text-sm text-slate-600">Page {currentPage} of {pageCount}</span>
          {currentPage < pageCount ? (
            <Link href={paginationHref(currentPage + 1)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#16a34a] hover:text-[#15803d]">
              Next
            </Link>
          ) : (
            <span aria-disabled="true" className="rounded-lg border border-slate-100 px-4 py-2 text-sm text-slate-400">Next</span>
          )}
        </nav>
      ) : null}
    </>
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
