"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { setWishlistItem } from "@/src/app/wishlist/wishlist.actions";
import { addProductToCart } from "@/src/app/cart/cart.actions";
import type { Product } from "@/src/app/(home)/home.interface";
import { getTotalCartQuantity } from "@/src/app/cart/cart.interface";
import {
  RiCheckLine,
  RiEyeLine,
  RiHeartFill,
  RiHeartLine,
  RiShoppingCartLine,
  RiStarFill,
  RiStarLine,
  RiRefreshLine,
} from "@remixicon/react";

type ProductCardProps = {
  product: Product;
  addLabel?: string;
  initialFavorite?: boolean;
};

export function ProductCard({ product, addLabel = "Add to Cart", initialFavorite = false }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isWishlistPending, setIsWishlistPending] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [isCompared, setIsCompared] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isCartPending, setIsCartPending] = useState(false);
  const [cartError, setCartError] = useState("");
  const addedFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasDiscount = typeof product.priceAfterDiscount === "number" && product.priceAfterDiscount < product.price;
  const price = hasDiscount ? product.priceAfterDiscount! : product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - price) / product.price) * 100) : 0;
  const image = product.imageCover || product.images?.[0] || "/file.svg";
  const formatPrice = (amount: number) => `${new Intl.NumberFormat("en-EG", { maximumFractionDigits: 2 }).format(amount)} EGP`;

  useEffect(() => () => {
    if (addedFeedbackTimer.current) clearTimeout(addedFeedbackTimer.current);
  }, []);

  return (
    <article className="group flex h-full min-w-0 flex-col rounded-2xl border border-[#e8edf7] bg-white p-2.5 shadow-[0_2px_5px_rgba(31,41,55,0.06)] transition-shadow hover:shadow-[0_8px_24px_rgba(31,41,55,0.12)] sm:p-3">
      <div className="relative block aspect-[3/4] overflow-hidden rounded-lg bg-white">
        <Link href={`/productDetails/${encodeURIComponent(product.id || product._id)}`} aria-label={`View ${product.title}`} className="absolute inset-0">
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 359px) 90vw, (max-width: 767px) 44vw, (max-width: 1023px) 22vw, 18vw"
            unoptimized
            className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </Link>
        {discountPercent > 0 ? (
          <span className="absolute left-2 top-2 rounded-md bg-[#ef3340] px-2 py-1 text-[10px] font-bold leading-none text-white shadow-sm sm:text-xs">
            -{discountPercent}%
          </span>
        ) : null}
        <div className="absolute right-2 top-2 flex flex-col gap-1.5 sm:right-2.5 sm:top-2.5">
          <button
            type="button"
            aria-label={isFavorite ? `Remove ${product.title} from favorites` : `Add ${product.title} to favorites`}
            aria-pressed={isFavorite}
            disabled={isWishlistPending}
            onClick={async () => {
              const nextFavorite = !isFavorite;
              setWishlistError("");
              setIsFavorite(nextFavorite);
              setIsWishlistPending(true);
              try {
                const count = await setWishlistItem(product.id || product._id, nextFavorite);
                window.dispatchEvent(new CustomEvent("wishlist-count-change", { detail: count }));
              } catch (error) {
                setIsFavorite(!nextFavorite);
                setWishlistError(error instanceof Error ? error.message : "Unable to update your wishlist.");
              } finally {
                setIsWishlistPending(false);
              }
            }}
            className="flex size-8 items-center justify-center rounded-full bg-white/95 text-[#52645a] shadow-sm transition-colors hover:text-[#ba1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08783c] sm:size-9"
          >
            {isFavorite ? <RiHeartFill aria-hidden="true" className="size-4 text-[#d43b45]" /> : <RiHeartLine aria-hidden="true" className="size-4 sm:size-[18px]" />}
          </button>
          <button
            type="button"
            aria-label={isCompared ? `Remove ${product.title} from comparison` : `Compare ${product.title}`}
            aria-pressed={isCompared}
            onClick={() => setIsCompared((value) => !value)}
            className="flex size-8 items-center justify-center rounded-full bg-white/95 text-[#52645a] shadow-sm transition-colors hover:text-[#08783c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08783c] sm:size-9"
          >
            <RiRefreshLine aria-hidden="true" className="size-4 sm:size-[18px]" />
          </button>
          <Link href={`/productDetails/${encodeURIComponent(product.id || product._id)}`} aria-label={`View ${product.title}`} className="flex size-8 items-center justify-center rounded-full bg-white/95 text-[#52645a] shadow-sm transition-colors hover:text-[#08783c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08783c] sm:size-9">
            <RiEyeLine aria-hidden="true" className="size-4 sm:size-[18px]" />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-0.5 pt-2.5 sm:px-1 sm:pt-3">
        {wishlistError ? <p role="status" className="mb-1 text-[10px] text-rose-600">{wishlistError}</p> : null}
        <p className="truncate text-[9px] font-semibold uppercase tracking-[0.06em] text-[#718277] sm:text-[10px]">{product.category?.name}</p>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-[13px] font-semibold leading-5 text-[#1a2f23] sm:text-sm"><Link href={`/productDetails/${encodeURIComponent(product.id || product._id)}`} className="hover:text-[#08783c]">{product.title}</Link></h3>

        <div className="mt-1.5 flex items-center gap-1 text-[11px] sm:text-xs">
          <span className="inline-flex shrink-0 items-center gap-px text-[#f5a900]" aria-label={`${product.ratingsAverage} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => index < Math.round(product.ratingsAverage) ? <RiStarFill key={index} aria-hidden="true" className="size-3 sm:size-3.5" /> : <RiStarLine key={index} aria-hidden="true" className="size-3 sm:size-3.5" />)}
          </span>
          <span className="font-semibold text-[#293c30]">{product.ratingsAverage.toFixed(1)}</span>
          <span className="text-[#718077]">({product.ratingsQuantity})</span>
        </div>

        <div className="mt-2 flex min-h-8 flex-wrap items-baseline gap-x-2 gap-y-0.5 border-t border-[#e8edf7] pt-2 lg:min-h-0 lg:flex-col-reverse lg:items-start lg:gap-0 lg:pt-2.5">
          <span className="text-base font-bold leading-5 tracking-tight text-[#08783c] sm:text-lg">{formatPrice(price)}</span>
          {hasDiscount ? <span className="text-[11px] leading-4 text-[#718077] line-through sm:text-xs">{formatPrice(product.price)}</span> : null}
        </div>

        <button
          type="button"
          disabled={product.quantity <= 0 || isCartPending}
          onClick={async () => {
            setIsCartPending(true);
            setIsAdded(false);
            setCartError("");
            try {
              const cart = await addProductToCart(product.id || product._id);
              setIsAdded(true);
              if (addedFeedbackTimer.current) clearTimeout(addedFeedbackTimer.current);
              addedFeedbackTimer.current = setTimeout(() => setIsAdded(false), 650);
              window.dispatchEvent(new CustomEvent("cart-count-change", { detail: getTotalCartQuantity(cart) }));
            } catch (error) {
              setCartError(error instanceof Error ? error.message : "Unable to add this product to your cart.");
            } finally {
              setIsCartPending(false);
            }
          }}
          aria-label={isCartPending ? `Adding ${product.title} to cart` : isAdded ? `${product.title} added to cart` : `${addLabel}: ${product.title}`}
          aria-busy={isCartPending}
          className={`mt-2.5 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08783c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 lg:mt-auto lg:size-11 lg:min-h-11 lg:w-11 lg:self-end lg:rounded-full lg:p-0 ${isAdded ? "bg-[#105d32]" : "bg-[#08783c] hover:bg-[#116a39]"}`}
        >
          {isAdded ? <RiCheckLine aria-hidden="true" className="size-4 sm:size-[18px]" /> : <RiShoppingCartLine aria-hidden="true" className="size-4 sm:size-[18px]" />}
          <span className="lg:hidden">{isCartPending ? "Adding…" : isAdded ? "Added" : addLabel}</span>
        </button>
        {cartError ? <p role="status" className="mt-2 text-[10px] text-rose-600">{cartError}</p> : null}
      </div>
    </article>
  );
}




