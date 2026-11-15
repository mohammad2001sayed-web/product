"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Brandarr } from "@/src/app/brands/brands.interface";

type BrandsCatalogProps = {
  brands: Brandarr[];
  products?: never;
  loadError: boolean;
};

export function BrandsCatalog({ brands, loadError }: BrandsCatalogProps) {
  const router = useRouter();

  const handleBrandClick = (brand: Brandarr) => {
    router.push(`/brands/${brand._id}`);
  };

  return (
    <div className=" mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {loadError ? (
        <p role="alert" className="mb-6 rounded-xl border border-rose-200 bg-white p-4 text-sm text-rose-700">
          Brands could not be loaded right now. Please try again in a moment.
        </p>
      ) : null}
      {!loadError && brands.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600">No brands are available right now.</p>
      ) : null}
      {brands.length > 0 ? (
        <>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Explore the collection</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Shop by brand</h2>
            </div>
            <p className="text-sm text-slate-500">{brands.length} brands to discover</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {brands.map((brand) => (
              <button
                key={brand._id}
                type="button"
                onClick={() => handleBrandClick(brand)}
                className="group cursor-pointer flex min-h-52 flex-col rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:min-h-64 sm:p-5"
              >
                <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-4 sm:p-6">
                  {brand.image ? (
                    <Image src={brand.image} alt={`${brand.name} logo`} fill sizes="(max-width: 639px) 42vw, (max-width: 1023px) 25vw, 16vw" unoptimized className="object-contain p-5 transition-transform duration-300 group-hover:scale-105 sm:p-7" />
                  ) : (
                    <span className="text-3xl font-bold tracking-tight text-slate-400">{brand.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </span>
                <span className="mt-4 flex w-full items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-slate-900 sm:text-base">{brand.name}</span>
                </span>
<span className="mt-1 text-xs  opacity-0 -translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 text-blue-700">
    View products →
  </span>              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
