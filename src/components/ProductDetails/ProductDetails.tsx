"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { setWishlistItem } from "@/src/app/wishlist/wishlist.actions";
import { addProductToCart } from "@/src/app/cart/cart.actions";
import type { Data } from "@/src/app/productDetails/productDetails.interface";
import type { Product } from "@/src/app/(home)/home.interface";
import { getTotalCartQuantity } from "@/src/app/cart/cart.interface";
import { ProductCard } from "@/src/components/ProductCard/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi>();
  const [recommendationsApi, setRecommendationsApi] = useState<CarouselApi>();
  const [recommendationNavigation, setRecommendationNavigation] = useState({ previous: false, next: false });
  const photos = useMemo(
    () => Array.from(new Set([product.imageCover, ...(product.images ?? [])].filter(Boolean))),
    [product],
  );
  const [activeImage, setActiveImage] = useState(photos[0] || "/file.svg");
  const [quantity, setQuantity] = useState(1);
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
  const reviewCount = Math.max(product.ratingsQuantity || 0, product.reviews?.length || 0);
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = product.reviews?.filter((review) => Math.round(review.rating) === stars).length || 0;
    return { stars, count, percentage: reviewCount ? Math.round((count / reviewCount) * 100) : 0 };
  });
  const activeImageIndex = Math.max(0, photos.indexOf(activeImage));

  useEffect(() => {
    thumbnailApi?.scrollTo(activeImageIndex);
  }, [activeImageIndex, thumbnailApi]);

  useEffect(() => {
    if (!thumbnailApi) return;
    const syncThumbnail = (api: CarouselApi) => {
      if (!api) return;
      const selectedPhoto = photos[api.selectedScrollSnap()];
      if (selectedPhoto) setActiveImage(selectedPhoto);
    };
    syncThumbnail(thumbnailApi);
    thumbnailApi.on("select", syncThumbnail);
    thumbnailApi.on("reInit", syncThumbnail);
    return () => {
      thumbnailApi.off("select", syncThumbnail);
      thumbnailApi.off("reInit", syncThumbnail);
    };
  }, [photos, thumbnailApi]);

  useEffect(() => {
    if (!recommendationsApi) return;
    const updateNavigation = (api: CarouselApi) => {
      if (!api) return;
      setRecommendationNavigation({ previous: api.canScrollPrev(), next: api.canScrollNext() });
    };
    updateNavigation(recommendationsApi);
    recommendationsApi.on("select", updateNavigation);
    recommendationsApi.on("reInit", updateNavigation);
    return () => {
      recommendationsApi.off("select", updateNavigation);
      recommendationsApi.off("reInit", updateNavigation);
    };
  }, [recommendationsApi]);

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

  function shareProduct() {
    if (navigator.share) {
      void navigator.share({ title: product.title, url: window.location.href });
    } else if (navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href);
    }
  }

  function renderThumbnail(photo: string, index: number) {
    return (
      <Button
        type="button"
        variant="ghost"
        aria-label={`View product photo ${index + 1}`}
        aria-pressed={activeImage === photo}
        onClick={() => setActiveImage(photo)}
        onKeyDown={(event) => {
          if (photos.length > 3 || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
          event.preventDefault();
          const nextIndex = (index + (event.key === "ArrowRight" ? 1 : -1) + photos.length) % photos.length;
          setActiveImage(photos[nextIndex]);
        }}
        className={`relative h-auto w-full overflow-hidden rounded-md border-2 p-0 transition-colors focus-visible:ring-2 focus-visible:ring-[#16a34a] ${activeImage === photo ? "border-[#3182ce]" : "border-transparent"}`}
      >
        <span className="relative block aspect-3/4 w-full bg-[#f4f4f4]">
          <Image src={photo} alt="" fill unoptimized sizes="(max-width: 1023px) 28vw, 10vw" className="object-contain" />
        </span>
      </Button>
    );
  }

  return (
    <main className="flex-1 bg-white pb-12">
      <div className="mx-auto w-full max-w-[1600px] px-3 pb-12 pt-4 sm:px-5 lg:px-6">
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

        <section className="grid items-start gap-5 lg:grid-cols-[minmax(260px,0.36fr)_minmax(0,1fr)] xl:gap-6">
          <Card className="gap-0 rounded-2xl border border-slate-100 bg-white p-3 pb-1 shadow-sm sm:p-4 sm:pb-1">
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
            {photos.length > 3 ? (
              <Carousel setApi={setThumbnailApi} opts={{ align: "center", loop: true }} aria-label="Product images" className="mt-3">
                <CarouselContent className="ml-0 gap-2">
                  {photos.map((photo, index) => <CarouselItem key={photo} className="basis-[29%] pl-0 sm:basis-[30%]">{renderThumbnail(photo, index)}</CarouselItem>)}
                </CarouselContent>
              </Carousel>
            ) : (
              <div aria-label="Product images" className="mt-3 flex justify-center gap-2">
                {photos.map((photo, index) => <div key={photo} className="w-[29%] sm:w-[30%]">{renderThumbnail(photo, index)}</div>)}
              </div>
            )}
          </Card>

          <Card className="gap-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
            <div className="flex flex-wrap gap-2">
              <Badge className="h-auto rounded-full bg-[#eaf7ef] px-3 py-1 text-[11px] font-medium text-[#168247] hover:bg-[#eaf7ef]">
                {product.category?.name || "FreshCart"}
              </Badge>
              <Badge variant="secondary" className="h-auto rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100">
                {product.brand?.name || "Brand"}
              </Badge>
            </div>

            <h1 className="mt-4 text-2xl font-bold leading-tight text-[#111827] sm:text-3xl lg:text-[34px]">
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
              {product.sold > 0 ? <span className="text-slate-500">· {product.sold}+ sold</span> : null}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <strong className="text-3xl font-bold tracking-tight text-[#111827] sm:text-[36px]">
                {money(price)}
              </strong>
              {discounted ? (
                <>
                  <span className="text-sm text-slate-400 line-through sm:text-base">
                    {money(product.price)}
                  </span>
                  <Badge variant="destructive" className="h-auto rounded-full bg-[#ef3340] px-3 py-1 text-[11px] font-semibold text-white">
                    Save {discount}%
                  </Badge>
                </>
              ) : null}
            </div>

            <Badge className={`mt-4 h-auto rounded-full px-3 py-1 text-xs font-medium ${available ? "bg-[#effbf4] text-[#168247] hover:bg-[#effbf4]" : "bg-rose-50 text-rose-700 hover:bg-rose-50"}`}>
              <span aria-hidden="true" className={`size-1.5 rounded-full ${available ? "bg-[#16b364]" : "bg-red-500"}`} />
              {available ? "In Stock" : "Out of Stock"}
            </Badge>

            <Separator className="mt-5 bg-slate-100" />
            <p className="pt-5 text-sm leading-7 text-slate-600 sm:text-base">
              {product.description}
            </p>

            <div className="mt-4">
              <label className="text-sm font-medium text-slate-700" htmlFor="product-quantity">
                Quantity
              </label>
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                <div className="inline-flex h-12 items-center overflow-hidden rounded-lg border border-slate-200">
                  <Button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    variant="ghost"
                    size="icon-lg"
                    className="h-full w-12 rounded-none text-lg text-slate-500 hover:bg-slate-50"
                  >
                    <span aria-hidden="true">−</span>
                  </Button>
                  <span id="product-quantity" aria-live="polite" className="min-w-10 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <Button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= available}
                    onClick={() => setQuantity((value) => Math.min(available, value + 1))}
                    variant="ghost"
                    size="icon-lg"
                    className="h-full w-12 rounded-none text-lg text-slate-600 hover:bg-slate-50"
                  >
                    +
                  </Button>
                </div>
                <span className="text-xs text-slate-500">{available} available</span>
              </div>
            </div>

            <Card className="mt-4 flex-row items-center justify-between gap-2 rounded-lg bg-[#f7f8fa] px-3.5 py-3 text-sm ring-0 sm:px-4">
              <span className="text-slate-600">Total Price:</span>
              <strong className="text-lg font-bold text-[#16a34a] sm:text-xl">
                {money(price * quantity)}
              </strong>
            </Card>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <Button
                type="button"
                disabled={!available || cartPending}
                aria-busy={cartPending}
                variant="default"
                size="lg"
                onClick={() => void addSelectedQuantity()}
                className="h-12 min-h-12 flex-1 rounded-lg bg-[#16a34a] px-4 text-sm font-semibold text-white shadow-md shadow-green-800/15 hover:bg-[#128c3f] disabled:bg-slate-400"
              >
                {added ? <RiCheckLine aria-hidden="true" className="size-4" /> : <RiShoppingCartLine aria-hidden="true" className="size-4" />}
                {cartPending ? "Adding…" : added ? "Added to Cart" : "Add to Cart"}
              </Button>
              <Button
                type="button"
                disabled={!available || cartPending}
                variant="default"
                size="lg"
                onClick={async () => { if (await addSelectedQuantity()) router.push("/cart"); }}
                className="h-12 min-h-12 flex-1 rounded-lg bg-[#111827] px-4 text-sm font-semibold text-white hover:bg-[#253145] disabled:bg-slate-400"
              >
                <RiFlashlightLine aria-hidden="true" className="size-4" /> Buy Now
              </Button>
            </div>
            {cartError ? <p role="status" className="mt-2 text-xs text-rose-600">{cartError}</p> : null}

            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_44px] gap-2">
              <Button
                type="button"
                aria-pressed={favorite}
                disabled={wishlistPending}
                variant="outline"
                size="lg"
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
                className={`h-11 flex-1 rounded-lg text-sm font-medium ${favorite ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-50" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {favorite ? <RiHeartFill aria-hidden="true" className="size-4 text-rose-500" /> : <RiHeartLine aria-hidden="true" className="size-4" />}
                {favorite ? "Added to Wishlist" : "Add to Wishlist"}
              </Button>
              <Button
                type="button"
                aria-label="Share product"
                variant="outline"
                size="icon-lg"
                onClick={shareProduct}
                className="h-11 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <RiShareLine aria-hidden="true" className="size-4" />
              </Button>
            </div>
            {wishlistError ? <p role="status" className="mt-2 text-xs text-rose-600">{wishlistError}</p> : null}

            <div className="mt-4 grid grid-cols-3 gap-2 pt-4 sm:gap-3">
              <Separator className="col-span-3 mb-1 bg-slate-100" />
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
          </Card>
        </section>

        <Card className="mt-8 gap-0 overflow-hidden rounded-2xl border border-slate-100 bg-white p-0 shadow-sm sm:mt-10">
          <Tabs defaultValue="details" className="gap-0">
            <TabsList variant="line" className="flex min-h-14 h-auto w-full items-stretch justify-start overflow-x-auto overflow-y-hidden rounded-none border-b border-slate-100 bg-white p-0">
              <TabsTrigger value="details" className="h-auto min-h-14 flex-none rounded-none border-b-2 border-transparent px-4 text-slate-600 after:hidden data-active:border-[#16a34a] data-active:bg-[#f2fbf5] data-active:text-[#16a34a] sm:px-7"><RiCheckLine aria-hidden="true" />Product Details</TabsTrigger>
              <TabsTrigger value="reviews" className="h-auto min-h-14 flex-none rounded-none border-b-2 border-transparent px-4 text-slate-600 after:hidden data-active:border-[#16a34a] data-active:bg-[#f2fbf5] data-active:text-[#16a34a] sm:px-7"><RiStarFill aria-hidden="true" />Reviews ({product.ratingsQuantity})</TabsTrigger>
              <TabsTrigger value="shipping" className="h-auto min-h-14 flex-none rounded-none border-b-2 border-transparent px-4 text-slate-600 after:hidden data-active:border-[#16a34a] data-active:bg-[#f2fbf5] data-active:text-[#16a34a] sm:px-7"><RiTruckLine aria-hidden="true" />Shipping &amp; Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="p-4 sm:p-6">
                <h2 className="text-base font-semibold text-[#18251e]">About this Product</h2>
                <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                  {product.description}
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <Card className="gap-2 rounded-lg bg-[#f7f8fa] p-3.5 ring-0 sm:p-4">
                    <h3 className="text-sm font-medium text-slate-700">Product Information</h3>
                    <dl className="mt-2 space-y-1.5 text-xs text-slate-600">
                      {[
                        ["Category", product.category?.name || "—"],
                        ["Subcategory", subcategory],
                        ["Brand", product.brand?.name || "—"],
                        ["Items Sold", `${product.sold}+ sold`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-3">
                          <dt className="shrink-0 text-slate-500">{label}</dt>
                          <dd className="text-right font-medium text-slate-700">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </Card>
                  <Card className="gap-2 rounded-lg bg-[#f7f8fa] p-3.5 ring-0 sm:p-4">
                    <h3 className="text-sm font-medium text-slate-700">Key Features</h3>
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                      {productFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <RiCheckLine aria-hidden="true" className="size-4 shrink-0 text-[#16a34a]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-4 sm:p-6">
                <div className="grid gap-6 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center sm:gap-7">
                  <div className="text-center">
                    <p className="text-5xl font-bold tracking-tight text-[#111827]">{rating.toFixed(1)}</p>
                    <div className="mt-2 flex justify-center gap-0.5 text-amber-400" aria-label={`${rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, index) => index < Math.round(rating)
                        ? <RiStarFill key={index} aria-hidden="true" className="size-5" />
                        : <RiStarLine key={index} aria-hidden="true" className="size-5" />)}
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Based on {reviewCount} reviews</p>
                  </div>
                  <div className="space-y-2">
                    {ratingDistribution.map(({ stars, percentage }) => (
                      <div key={stars} className="grid grid-cols-[42px_minmax(0,1fr)_38px] items-center gap-3 text-sm text-slate-600">
                        <span>{stars} star</span>
                        <span className="h-2.5 overflow-hidden rounded-full bg-slate-200" role="img" aria-label={`${percentage}% ${stars}-star reviews`}>
                          <span className="block h-full rounded-full bg-amber-400" style={{ width: `${percentage}%` }} />
                        </span>
                        <span className="text-right">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="my-6 bg-slate-200" />
                {product.reviews?.length ? (
                  <div className="divide-y divide-slate-100">
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
                  <div className="py-5 text-center">
                    <RiStarFill aria-hidden="true" className="mx-auto size-9 text-slate-300" />
                    <p className="mt-3 text-sm text-slate-500">Customer reviews will be displayed here.</p>
                  </div>
                )}
            </TabsContent>

            <TabsContent value="shipping" className="p-4 sm:p-6">
                <h2 className="text-base font-semibold text-[#18251e]">Shipping &amp; Returns</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Free delivery on orders over 500 EGP. Return eligible items within 30 days for a refund.
                </p>
            </TabsContent>
          </Tabs>
        </Card>

        {recommendations.length > 0 ? (
          <section className="mt-10 sm:mt-12" aria-label="You may also like">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="border-l-4 border-[#16a34a] pl-3 text-lg font-bold text-[#121c2a] sm:text-2xl">
                You May Also <span className="text-[#16a34a]">Like</span>
              </h2>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon-lg" aria-label="Previous recommendations" disabled={!recommendationNavigation.previous} onClick={() => recommendationsApi?.scrollPrev()} className="rounded-full bg-slate-100 text-slate-600 hover:bg-[#eaf7ef] hover:text-[#16a34a]"><RiArrowLeftSLine aria-hidden="true" /></Button>
                <Button type="button" variant="outline" size="icon-lg" aria-label="Next recommendations" disabled={!recommendationNavigation.next} onClick={() => recommendationsApi?.scrollNext()} className="rounded-full bg-slate-100 text-slate-600 hover:bg-[#eaf7ef] hover:text-[#16a34a]"><RiArrowRightSLine aria-hidden="true" /></Button>
              </div>
            </div>
            <Carousel setApi={setRecommendationsApi} opts={{ align: "start" }} aria-label="Recommended products" className="px-1">
              <CarouselContent className="ml-0">
              {recommendations.map((item) => (
                <CarouselItem key={item.id || item._id} className="basis-full pl-3 pr-1 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 [&>article]:p-2 sm:[&>article]:p-2.5 [&_h3]:min-h-8 [&_h3]:text-xs [&_h3]:leading-4 [&_article>div:first-child]:aspect-[4/3] [&_article>div:nth-child(2)>div:nth-of-type(2)>span:first-child]:text-sm sm:[&_article>div:nth-child(2)>div:nth-of-type(2)>span:first-child]:text-base">
                  <ProductCard product={item} />
                </CarouselItem>
              ))}
              </CarouselContent>
            </Carousel>
          </section>
        ) : null}
      </div>
    </main>
  );
}



