"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setWishlistItem } from "@/src/app/wishlist/wishlist.actions";
import { addProductToCart } from "@/src/app/cart/cart.actions";
import type { Data } from "@/src/app/productDetails/productDetails.interface";
import type { Product } from "@/src/app/(home)/home.interface";
import { getTotalCartQuantity } from "@/src/app/cart/cart.interface";
import { ProductCard } from "@/src/components/ProductCard/ProductCard";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiFlashlightLine,
  RiHeartFill,
  RiHeartLine,
  RiHome4Line,
  RiShareLine,
  RiShieldCheckLine,
  RiShoppingCartLine,
  RiStarFill,
  RiStarLine,
  RiTruckLine,
  RiRefreshLine,
} from "@remixicon/react";

type Props = { product: Data; recommendations: Product[]; initialFavorite?: boolean };
type ProductTab = "details" | "reviews" | "shipping";

const money = (amount: number) =>
  `${new Intl.NumberFormat("en-EG", { maximumFractionDigits: 2 }).format(amount)} EGP`;

const productFeatures = [
  "Premium Quality Product",
  "100% Authentic Guarantee",
  "Fast & Secure Packaging",
  "Quality Tested",
];

export function ProductDetails({ product, recommendations, initialFavorite = false }: Props) {
  const router = useRouter();
  const thumbnailTrack = useRef<HTMLDivElement>(null);
  const recommendationsTrack = useRef<HTMLDivElement>(null);
  const photos = useMemo(
    () => Array.from(new Set([product.imageCover, ...(product.images ?? [])].filter(Boolean))),
    [product],
  );
  const [activeImage, setActiveImage] = useState(photos[0] || "/file.svg");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<ProductTab>("details");
  const [favorite, setFavorite] = useState(initialFavorite);
  const [wishlistPending, setWishlistPending] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [added, setAdded] = useState(false);
  const [cartPending, setCartPending] = useState(false);
  const [cartError, setCartError] = useState("");
  const discounted =
    typeof product.priceAfterDiscount === "number" &&
    product.priceAfterDiscount < product.price;
  const price = discounted ? product.priceAfterDiscount! : product.price;
  const discount = discounted
    ? Math.round((1 - price / product.price) * 100)
    : 0;
  const available = Math.max(0, product.quantity);
  const subcategory =
    product.subcategory?.map((item) => item.name).filter(Boolean).join(", ") ||
    "General";
  const rating = Number(product.ratingsAverage || 0);
  const tabs: { id: ProductTab; label: string }[] = [
    { id: "details", label: "Product Details" },
    { id: "reviews", label: `Reviews (${product.ratingsQuantity})` },
    { id: "shipping", label: "Shipping & Returns" },
  ];

  async function addSelectedQuantity() {
    if (!available || cartPending) return false;
    setCartPending(true);
    setCartError("");
    try {
      let cart;
      for (let index = 0; index < quantity; index += 1) {
        cart = await addProductToCart(product.id || product._id);
      }
      if (cart) {
        window.dispatchEvent(new CustomEvent("cart-count-change", { detail: getTotalCartQuantity(cart) }));
      }
      setAdded(true);
      return true;
    } catch (error) {
      setCartError(error instanceof Error ? error.message : "Unable to add this product to your cart.");
      return false;
    } finally {
      setCartPending(false);
    }
  }

  function scrollRecommendations(direction: -1 | 1) {
    recommendationsTrack.current?.scrollBy({
      left: direction * recommendationsTrack.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex + tabs.length - 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex !== null) {
      event.preventDefault();
      setActiveTab(tabs[nextIndex].id);
      document.getElementById(`product-tab-${tabs[nextIndex].id}`)?.focus();
    }
  }

  function shareProduct() {
    if (navigator.share) {
      void navigator.share({ title: product.title, url: window.location.href });
    } else if (navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <main className="flex-1 bg-white pb-12">
      <div className="mx-auto w-full max-w-[1880px] px-3 pb-12 pt-4 sm:px-5 lg:px-6">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-xs text-slate-500 sm:text-sm"
        >
          <Link href="/" aria-label="Home" className="inline-flex shrink-0 items-center gap-1 hover:text-[#16a34a]">
            <RiHome4Line aria-hidden="true" className="size-4" />
            Home
          </Link>
          <span aria-hidden="true" className="text-slate-400">›</span>
          <Link href="/categories" className="shrink-0 hover:text-[#16a34a]">
            {product.category?.name || "Categories"}
          </Link>
          <span aria-hidden="true" className="text-slate-400">›</span>
          <Link href="/categories" className="shrink-0 hover:text-[#16a34a]">
            {subcategory}
          </Link>
          <span aria-hidden="true" className="text-slate-400">›</span>
          <span className="min-w-0 truncate text-slate-800" title={product.title}>{product.title}</span>
        </nav>

        <section className="grid items-start gap-5 lg:grid-cols-[minmax(280px,0.34fr)_minmax(0,1fr)] xl:gap-7">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-[#f4f4f4]">
              <Image
                src={activeImage}
                alt={product.title}
                fill
                priority
                unoptimized
                sizes="(max-width: 1023px) 90vw, 30vw"
                className="object-contain"
              />
            </div>
            <div ref={thumbnailTrack} aria-label="Product images" className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-1 scrollbar-thin sm:gap-3">
              {photos.map((photo, index) => (
                <button
                  key={photo}
                  type="button"
                  aria-label={`View product photo ${index + 1}`}
                  aria-pressed={activeImage === photo}
                  onClick={() => setActiveImage(photo)}
                  className={`relative aspect-3/4 w-[35%] shrink-0 snap-start overflow-hidden rounded-md border-2 bg-[#f4f4f4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168247] sm:w-[34%] ${
                    activeImage === photo ? "border-[#3182ce]" : "border-transparent"
                  }`}
                >
                  <Image
                    src={photo}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 1023px) 28vw, 10vw"
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7 lg:p-9">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#eaf7ef] px-3 py-1 text-[11px] font-medium text-[#168247]">
                {product.category?.name || "FreshCart"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                {product.brand?.name || "Brand"}
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-bold leading-tight text-[#111827] sm:text-3xl lg:text-[38px]">
              {product.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="flex items-center gap-0.5 text-amber-400" aria-label={`${rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) =>
                  index < Math.round(rating) ? (
                    <RiStarFill key={index} aria-hidden="true" className="size-4 sm:size-4.5" />
                  ) : (
                    <RiStarLine key={index} aria-hidden="true" className="size-4 sm:size-4.5" />
                  ),
                )}
              </span>
              <span className="font-medium text-slate-600">
                {Number.isInteger(rating) ? rating : rating.toFixed(1)} ({product.ratingsQuantity} reviews)
              </span>
              {product.sold > 0 ? <span className="text-slate-500">Â· {product.sold}+ sold</span> : null}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <strong className="text-3xl font-bold tracking-tight text-[#111827] sm:text-[40px]">
                {money(price)}
              </strong>
              {discounted ? (
                <>
                  <span className="text-sm text-slate-400 line-through sm:text-base">
                    {money(product.price)}
                  </span>
                  <span className="rounded-full bg-[#ef3340] px-3 py-1 text-[11px] font-semibold text-white">
                    Save {discount}%
                  </span>
                </>
              ) : null}
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#effbf4] px-3 py-1 text-xs font-medium text-[#168247]">
              <span aria-hidden="true" className={`size-1.5 rounded-full ${available ? "bg-[#16b364]" : "bg-red-500"}`} />
              {available ? "In Stock" : "Out of Stock"}
            </div>

            <p className="mt-5 border-t border-slate-100 pt-5 text-sm leading-7 text-slate-600 sm:text-base">
              {product.description}
            </p>

            <div className="mt-4">
              <label className="text-sm font-medium text-slate-700" htmlFor="product-quantity">
                Quantity
              </label>
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                <div className="inline-flex h-12 items-center overflow-hidden rounded-lg border border-slate-200">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="h-full w-12 text-lg text-slate-500 hover:bg-slate-50 disabled:text-slate-300"
                  >
                    <span aria-hidden="true">−</span>
                  </button>
                  <span id="product-quantity" aria-live="polite" className="min-w-10 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= available}
                    onClick={() => setQuantity((value) => Math.min(available, value + 1))}
                    className="h-full w-12 text-lg text-slate-600 hover:bg-slate-50 disabled:text-slate-300"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500">{available} available</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-[#f7f8fa] px-3.5 py-3 text-sm sm:px-4">
              <span className="text-slate-600">Total Price:</span>
              <strong className="text-lg font-bold text-[#16a34a] sm:text-xl">
                {money(price * quantity)}
              </strong>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                disabled={!available || cartPending}
                aria-busy={cartPending}
                onClick={() => void addSelectedQuantity()}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#16a34a] px-4 text-sm font-semibold text-white shadow-md shadow-green-800/15 transition-colors hover:bg-[#128c3f] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {added ? <RiCheckLine aria-hidden="true" className="size-4" /> : <RiShoppingCartLine aria-hidden="true" className="size-4" />}
                {cartPending ? "Adding…" : added ? "Added to Cart" : "Add to Cart"}
              </button>
              <button
                type="button"
                disabled={!available || cartPending}
                onClick={async () => { if (await addSelectedQuantity()) router.push("/cart"); }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#111827] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#253145] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                <RiFlashlightLine aria-hidden="true" className="size-4" /> Buy Now
              </button>
            </div>
            {cartError ? <p role="status" className="mt-2 text-xs text-rose-600">{cartError}</p> : null}

            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_44px] gap-2">
              <button
                type="button"
                aria-pressed={favorite}
                disabled={wishlistPending}
                onClick={async () => {
                  const nextFavorite = !favorite;
                  setFavorite(nextFavorite);
                  setWishlistPending(true);
                  setWishlistError("");
                  try {
                    const count = await setWishlistItem(product.id || product._id, nextFavorite);
                    window.dispatchEvent(new CustomEvent("wishlist-count-change", { detail: count }));
                  } catch (error) {
                    setFavorite(!nextFavorite);
                    setWishlistError(error instanceof Error ? error.message : "Unable to update your wishlist.");
                  } finally {
                    setWishlistPending(false);
                  }
                }}
                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors ${favorite ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {favorite ? <RiHeartFill aria-hidden="true" className="size-4 text-rose-500" /> : <RiHeartLine aria-hidden="true" className="size-4" />}
                {favorite ? "Added to Wishlist" : "Add to Wishlist"}
              </button>
              <button
                type="button"
                aria-label="Share product"
                onClick={shareProduct}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
              >
                <RiShareLine aria-hidden="true" className="size-4" />
              </button>
            </div>
            {wishlistError ? <p role="status" className="mt-2 text-xs text-rose-600">{wishlistError}</p> : null}

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 sm:gap-3">
              {[
                { Icon: RiTruckLine, title: "Free Delivery", description: "Orders over $50" },
                { Icon: RiRefreshLine, title: "30 Days Return", description: "Money back" },
                { Icon: RiShieldCheckLine, title: "Secure Payment", description: "100% Protected" },
              ].map(({ Icon, title, description }) => (
                <div key={title} className="flex min-w-0 items-center gap-2 text-[10px] sm:gap-2.5 sm:text-xs">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e5faed] text-[#16a34a] sm:size-9">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <b className="block truncate font-medium text-slate-700">{title}</b>
                    <span className="block truncate text-slate-500">{description}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm sm:mt-10">
          <div role="tablist" aria-label="Product information" className="flex overflow-x-auto border-b border-slate-100">
            {tabs.map((item) => (
              <button
                key={item.id}
                id={`product-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === item.id}
                aria-controls="product-tab-panel"
                tabIndex={activeTab === item.id ? 0 : -1}
                onKeyDown={handleTabKeyDown}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-3 text-xs font-medium sm:px-5 sm:text-sm ${activeTab === item.id ? "border-[#16a34a] bg-[#f2fbf5] text-[#16a34a]" : "border-transparent text-slate-600 hover:bg-slate-50"}`}
              >
                {item.id === "details" ? <RiCheckLine aria-hidden="true" className="size-4" /> : null}
                {item.id === "reviews" ? <RiStarFill aria-hidden="true" className="size-4" /> : null}
                {item.id === "shipping" ? <RiTruckLine aria-hidden="true" className="size-4" /> : null}
                {item.label}
              </button>
            ))}
          </div>

          <div id="product-tab-panel" role="tabpanel" aria-labelledby={`product-tab-${activeTab}`} className="p-4 sm:p-6">
            {activeTab === "details" ? (
              <>
                <h2 className="text-base font-semibold text-[#18251e]">About this Product</h2>
                <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                  {product.description}
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg bg-[#f7f8fa] p-3.5 sm:p-4">
                    <h3 className="text-sm font-medium text-slate-700">Product Information</h3>
                    <dl className="mt-2 space-y-1.5 text-xs text-slate-600">
                      {[
                        ["Category", product.category?.name || "â€”"],
                        ["Subcategory", subcategory],
                        ["Brand", product.brand?.name || "â€”"],
                        ["Items Sold", `${product.sold}+ sold`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-3">
                          <dt className="shrink-0 text-slate-500">{label}</dt>
                          <dd className="text-right font-medium text-slate-700">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="rounded-lg bg-[#f7f8fa] p-3.5 sm:p-4">
                    <h3 className="text-sm font-medium text-slate-700">Key Features</h3>
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                      {productFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <RiCheckLine aria-hidden="true" className="size-4 shrink-0 text-[#16a34a]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : null}

            {activeTab === "reviews" ? (
              <>
                <h2 className="text-base font-semibold text-[#18251e]">Customer Reviews</h2>
                {product.reviews?.length ? (
                  <div className="mt-3 divide-y divide-slate-100">
                    {product.reviews.map((review) => (
                      <article key={review._id} className="py-3 first:pt-0">
                        <div className="flex items-center justify-between gap-3">
                          <b className="text-sm text-slate-700">{review.user?.name || "Customer"}</b>
                          <span className="inline-flex items-center gap-1 text-sm text-amber-500">
                            <RiStarFill aria-hidden="true" className="size-4" /> {review.rating}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{review.review}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">No written reviews yet.</p>
                )}
              </>
            ) : null}

            {activeTab === "shipping" ? (
              <>
                <h2 className="text-base font-semibold text-[#18251e]">Shipping &amp; Returns</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Free delivery on orders over 500 EGP. Return eligible items within 30 days for a refund.
                </p>
              </>
            ) : null}
          </div>
        </section>

        {recommendations.length > 0 ? (
          <section className="mt-10 sm:mt-12" aria-label="You may also like">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="border-l-4 border-[#16a34a] pl-3 text-lg font-bold text-[#121c2a] sm:text-2xl">
                You May Also <span className="text-[#16a34a]">Like</span>
              </h2>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Scroll recommendations backward" onClick={() => scrollRecommendations(-1)} className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-[#eaf7ef] hover:text-[#16a34a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]"><RiArrowLeftSLine aria-hidden="true" className="size-6" /></button>
                <button type="button" aria-label="Scroll recommendations forward" onClick={() => scrollRecommendations(1)} className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-[#eaf7ef] hover:text-[#16a34a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]"><RiArrowRightSLine aria-hidden="true" className="size-6" /></button>
              </div>
            </div>
            <div ref={recommendationsTrack} aria-label="Recommended products" className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3 scrollbar-thin sm:gap-5">
              {recommendations.map((item) => (
                <div key={item.id || item._id} className="w-[72%] shrink-0 snap-start min-[480px]:w-[48%] sm:w-[32%] lg:w-[23%]">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}



