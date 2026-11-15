import type { Product } from "@/src/app/(home)/home.interface";
import { ProductCard } from "@/src/components/ProductCard/ProductCard";

type FeaturedProductsProps = {
  products: Product[];
  title?: string;
  description?: string;
  favoriteIds?: string[];
};

export function FeaturedProducts({
  products,
  title = "All Products",
  description = "Browse the full FreshCart product catalog.",
  favoriteIds = [],
}: FeaturedProductsProps) {
  return (
    <section aria-labelledby="featured-products-title" className="mx-auto w-full max-w-360 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#6cf8bb]/45 px-3 py-1.5 text-xs font-semibold text-[#005236]">
            <span aria-hidden="true" className="size-2 rounded-full bg-[#008b48]" />
            FreshCart Catalog
          </span>
          <h2 id="featured-products-title" className="border-l-4 border-[#008b48] pl-4 text-2xl font-bold tracking-tight text-[#121c2a] sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#55615a] sm:text-base">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 min-[360px]:grid-cols-2 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
        {products.map((product) => <ProductCard key={product.id} product={product} initialFavorite={favoriteIds.includes(product.id || product._id)} />)}
      </div>
    </section>
  );
}
