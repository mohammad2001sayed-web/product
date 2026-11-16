"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RiDeleteBinLine, RiShoppingCartLine } from "@remixicon/react";
import { setWishlistItem } from "@/src/app/wishlist/wishlist.actions";
import { addProductToCart } from "@/src/app/cart/cart.actions";
import type { Product } from "@/src/app/(home)/home.interface";
import { getTotalCartQuantity } from "@/src/app/cart/cart.interface";

export function WishlistItem({ product }: { product: Product }) {
  const [pending, setPending] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState("");
  const [cartPending, setCartPending] = useState(false);
  const productId = product.id || product._id;
  const price = product.priceAfterDiscount && product.priceAfterDiscount < product.price
    ? product.priceAfterDiscount
    : product.price;
  const available = product.quantity > 0;

  async function removeFromWishlist() {
    setPending(true);
    setError("");
    try {
      const count = await setWishlistItem(productId, false);
      window.dispatchEvent(new CustomEvent("wishlist-count-change", { detail: count }));
      setRemoved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to remove this product.");
      setPending(false);
    }
  }

  if (removed) return null;

  return (
    <article className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3 border-b border-slate-100 p-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_120px_120px_auto] sm:gap-5 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
        <Link href={`/productDetails/${encodeURIComponent(productId)}`} aria-label={`View ${product.title}`} className="relative size-19 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 sm:size-22">
          <Image src={product.imageCover || product.images?.[0] || "/file.svg"} alt={product.title} fill unoptimized sizes="88px" className="object-contain p-2" />
        </Link>
        <div className="min-w-0">
          <Link href={`/productDetails/${encodeURIComponent(productId)}`} className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900 hover:text-[#08783c] sm:text-base">{product.title}</Link>
          <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">{product.category?.name || "FreshCart"}</p>
          <p className="mt-1.5 text-sm font-bold text-slate-900 sm:hidden">{new Intl.NumberFormat("en-EG").format(price)} EGP</p>
        </div>
      </div>

      <p className="hidden text-sm font-semibold text-slate-900 sm:block">{new Intl.NumberFormat("en-EG").format(price)} EGP</p>
      <span className={`col-start-1 inline-flex w-fit items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium sm:col-auto ${available ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
        <span aria-hidden="true" className={`size-1.5 rounded-full ${available ? "bg-emerald-500" : "bg-slate-400"}`} />
        {available ? "In Stock" : "Out of Stock"}
      </span>
      <div className="col-start-2 row-start-1 flex items-center gap-2 sm:col-auto sm:row-auto">
        <button type="button" disabled={!available || cartPending} onClick={async () => { setCartPending(true); setError(""); try { const cart = await addProductToCart(productId); window.dispatchEvent(new CustomEvent("cart-count-change", { detail: getTotalCartQuantity(cart) })); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to add this product."); } finally { setCartPending(false); } }} aria-label={`Add ${product.title} to cart`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#16a34a] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#128c3f] disabled:cursor-not-allowed disabled:bg-slate-400 sm:px-4 sm:text-sm">
          <RiShoppingCartLine aria-hidden="true" className="size-4" /><span className="hidden min-[440px]:inline">Add to Cart</span>
        </button>
        <button type="button" disabled={pending} onClick={removeFromWishlist} aria-label={`Remove ${product.title} from wishlist`} className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50">
          <RiDeleteBinLine aria-hidden="true" className="size-4.5" />
        </button>
      </div>
      {error ? <p role="alert" className="col-span-2 text-xs text-rose-600 sm:col-span-4">{error}</p> : null}
    </article>
  );
}

