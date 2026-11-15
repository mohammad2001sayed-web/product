import { Suspense } from "react";
import { BrandsDataSection } from "@/src/components/BrandsDataSection/BrandsDataSection";

export default function BrandsPage() {
  return (
    <main className="flex-1 bg-[#f8f9fc]">
      <section className="relative overflow-hidden bg-linear-to-r from-violet-600 via-violet-500 to-fuchsia-400">
        <div aria-hidden="true" className="absolute -right-16 -top-32 size-96 rounded-full border-[48px] border-white/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold text-white/75">Home <span className="mx-2">/</span> Brands</p>
          <div className="mt-8 flex items-center gap-5">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-3xl text-white shadow-lg backdrop-blur sm:size-20" aria-hidden="true">✦</div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Top Brands</h1>
              <p className="mt-2 text-base text-white/85 sm:text-lg">Shop from your favorite brands</p>
            </div>
          </div>
        </div>
      </section>
      <Suspense
        fallback={
          <section
            aria-label="Loading brands"
            aria-busy="true"
            className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 px-4 py-10 sm:grid-cols-3 sm:gap-5 sm:px-6 md:grid-cols-4 lg:grid-cols-5 lg:px-8 xl:grid-cols-6"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
              >
                <div className="aspect-square rounded-xl bg-slate-100" />
                <div className="mt-4 h-4 w-2/3 rounded bg-slate-100" />
                <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
              </div>
            ))}
          </section>
        }
      >
        <BrandsDataSection />
      </Suspense>
    </main>
  );
}
