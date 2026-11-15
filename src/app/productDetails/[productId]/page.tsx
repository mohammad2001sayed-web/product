import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProducts } from "@/src/app/(home)/home.service";
import { getProductDetails } from "../productDetails.services";
import { getWishlist } from "@/src/app/wishlist/wishlist.api";
import { ProductDetails } from "@/src/components/ProductDetails/ProductDetails";

type ProductDetailsPageProps = {
  params: Promise<{ productId: string }>;
};

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <main aria-label="Loading product details" className="flex-1 bg-white pb-12">
          <div className="mx-auto w-full max-w-[1880px] animate-pulse px-3 pb-12 pt-4 sm:px-5 lg:px-6">
            <div className="mb-6 h-4 w-64 rounded bg-slate-100" />
            <div className="grid gap-5 lg:grid-cols-[minmax(230px,0.31fr)_minmax(0,1fr)]">
              <div className="aspect-[3/4] rounded-xl bg-slate-100" />
              <div className="min-h-[520px] rounded-xl bg-slate-100" />
            </div>
            <div className="mt-8 h-56 rounded-xl bg-slate-100" />
          </div>
        </main>
      }
    >
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}

async function ProductDetailsContent({ params }: ProductDetailsPageProps) {
  const { productId } = await params;
  let product;

  try {
    product = await getProductDetails(productId);
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const products = await getProducts().catch(() => []);
  const recommendations = products
    .filter((item) => (item.id || item._id) !== (product.id || product._id))
    .slice(0, 5);
  const wishlist = await getWishlist().catch(() => null);
  const isFavorite = Boolean(wishlist?.data?.some((item) => (item.id || item._id) === (product.id || product._id)));

  return <ProductDetails product={product} recommendations={recommendations} initialFavorite={isFavorite} />;
}
