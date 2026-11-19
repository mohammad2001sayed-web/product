import Image from "next/image";
import Link from "next/link";
import { RiStackLine } from "@remixicon/react";
import { Card, CardContent } from "@/components/ui/card";
import { getCategories } from "./categories.service";

export default async function CategoriesPage() {
  let categories;
  let hasError = false;

  try {
    categories = await getCategories();
  } catch {
    hasError = true;
  }

  return (
    <main className="flex-1 bg-[#f8f9ff]">
      <section className="bg-gradient-to-r from-[#15803d] to-[#16a34a] text-white">
        <div className="mx-auto max-w-360 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/80">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">Categories</li>
            </ol>
          </nav>
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <RiStackLine aria-hidden="true" className="size-7" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All Categories</h1>
              <p className="mt-2 text-sm text-white/85 sm:text-base">Browse our wide range of product categories</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-360 px-4 py-8 sm:px-6 sm:py-10 lg:px-8" aria-label="Product categories">
        {hasError ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-white p-5 text-sm text-red-700">
            Categories couldn’t be loaded right now. Please try again later.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
            {categories?.map((category) => (
              <Link
                key={category._id}
                href={`/shop?category=${encodeURIComponent(category._id)}`}
                aria-label={`Browse ${category.name}`}
                className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2"
              >
                <Card className="h-full border-0 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <CardContent className="p-3 sm:p-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 18vw"
                        className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                      />
                    </div>
                    <h2 className="mt-3 text-center text-sm font-bold text-[#121c2a] sm:text-base">{category.name}</h2>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
