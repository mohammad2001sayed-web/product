import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { RiArrowLeftLine, RiHeartLine } from "@remixicon/react";
import { getWishlist } from "./wishlist.api";
import type { Product } from "@/src/app/(home)/home.interface";
import { WishlistItem } from "@/src/components/WishlistItem/WishlistItem";

export default function WishlistPage() {
  return (
    <Suspense fallback={<WishlistLoading />}>
      <WishlistContent />
    </Suspense>
  );
}

async function WishlistContent() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let products: Product[] = [];
  let loadError = false;

  if (token) {
    try {
      const wishlist = await getWishlist();
      products = wishlist.data ?? [];
    } catch {
      loadError = true;
    }
  }

  return (
    <main className="min-h-[60vh] flex-1 bg-[#f8f9fc]">
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto w-full max-w-360 px-4 pb-8 pt-7 sm:px-6 sm:pb-10 sm:pt-9 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <Link href="/" className="transition-colors hover:text-[#16a34a]">Home</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="text-slate-800">Wishlist</span>
          </nav>

          <header className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 sm:size-16">
              <RiHeartLine aria-hidden="true" className="size-7 sm:size-8" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">My Wishlist</h1>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                {products.length ? <><span className="font-semibold text-slate-600">{products.length} {products.length === 1 ? "item" : "items"}</span> saved</> : "Keep the things you love all in one place"}
              </p>
            </div>
          </header>
        </div>
      </div>

      <div className="mx-auto w-full max-w-360 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {loadError ? (
          <section role="alert" className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">We couldn’t load your wishlist</h2>
            <p className="mt-2 text-sm text-slate-600">Please try again in a moment.</p>
          </section>
        ) : !token ? (
          <EmptyWishlist signedOut />
        ) : products.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <section aria-label="Saved products" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[minmax(0,1fr)_120px_120px_auto] items-center gap-5 border-b border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium text-slate-500 sm:grid">
              <span>Product</span><span>Price</span><span>Status</span><span className="pr-6 text-right">Actions</span>
            </div>
            {products.map((product) => <WishlistItem key={product.id || product._id} product={product} />)}
          </section>
        )}

        <div className="mt-8 border-t border-slate-200 pt-5">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[#16a34a] transition-colors hover:text-[#15803d]">
            <RiArrowLeftLine aria-hidden="true" className="size-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

function WishlistLoading() {
  return (
    <main aria-label="Loading wishlist" className="min-h-[60vh] flex-1 bg-[#f8f9fc]">
      <div className="mx-auto w-full max-w-360 animate-pulse px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 h-4 w-36 rounded bg-slate-200" />
        <div className="mb-8 h-16 w-72 rounded-xl bg-slate-200" />
        <div className="min-h-90 rounded-2xl border border-slate-200 bg-white" />
      </div>
    </main>
  );
}
function EmptyWishlist({ signedOut = false }: { signedOut?: boolean }) {
  return (
    <section className="flex min-h-90 flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 py-10 text-center shadow-sm sm:min-h-105 sm:py-12">
      <div className="relative mb-3 flex size-44 items-center justify-center sm:size-52">
        {/* Static empty-state artwork keeps the empty view welcoming without product fixtures. */}
        <Image src="/empty-wishlist.svg" alt="An empty shopping basket with a heart" fill sizes="208px" className="object-contain" />
      </div>
      <h2 className="mt-7 text-xl font-bold text-slate-900 sm:text-2xl">{signedOut ? "Sign in to see your wishlist" : "Your wishlist is waiting"}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
        {signedOut ? "Sign in to keep your favorite finds saved and ready whenever you are." : "You haven’t saved any products yet. Tap the heart on anything you love and it’ll show up here."}
      </p>
      <Link href={signedOut ? "/account" : "/shop"} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#16a34a] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#15803d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2">
        {signedOut ? "Sign In" : "Explore Products"}
      </Link>
    </section>
  );
}





