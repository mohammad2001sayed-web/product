"use client";

import Image from "next/image";
import Link from "next/link";
import { RiDeleteBinLine } from "@remixicon/react";
import type { CartItem } from "@/src/app/cart/cart.interface";

const money = (value: number) => `${new Intl.NumberFormat("en-EG", { maximumFractionDigits: 2 }).format(value)} EGP`;

export function CartItemRow({ item, pending, onQuantity, onRemove }: { item: CartItem; pending: boolean; onQuantity: (count: number) => void; onRemove: () => void }) {
  const product = item.product;
  const productId = product.id || product._id;
  const price = item.price || product.price;
  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 border-b border-slate-100 p-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_118px_148px_100px_auto] sm:gap-4 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
        <Link href={`/productDetails/${encodeURIComponent(productId)}`} aria-label={`View ${product.title}`} className="relative size-19 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 sm:size-22"><Image src={product.imageCover || product.images?.[0] || "/file.svg"} alt={product.title} fill unoptimized sizes="88px" className="object-contain p-2" /></Link>
        <div className="min-w-0"><Link href={`/productDetails/${encodeURIComponent(productId)}`} className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900 hover:text-[#08783c] sm:text-base">{product.title}</Link><p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">{product.category?.name || "FreshCart"}</p><p className="mt-1.5 text-sm font-bold text-slate-900 sm:hidden">{money(price)}</p></div>
      </div>
      <p className="hidden text-sm font-semibold text-slate-900 sm:block">{money(price)}</p>
      <div className="col-start-1 flex h-11 w-fit items-center rounded-xl border border-slate-200 bg-white p-1 sm:col-auto" aria-label={`Quantity for ${product.title}`}>
        <button type="button" aria-label={`Decrease ${product.title} quantity`} disabled={pending || item.count <= 1} onClick={() => onQuantity(item.count - 1)} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-50 disabled:text-slate-300">−</button>
        <span className="min-w-8 text-center text-sm font-semibold text-slate-800">{item.count}</span>
        <button type="button" aria-label={`Increase ${product.title} quantity`} disabled={pending || item.count >= product.quantity} onClick={() => onQuantity(item.count + 1)} className="grid size-9 place-items-center rounded-lg bg-[#16a34a] text-lg text-white hover:bg-[#128c3f] disabled:bg-slate-300">+</button>
      </div>
      <p className="hidden text-right text-sm font-bold text-slate-900 sm:block">{money(price * item.count)}</p>
      <button type="button" aria-label={`Remove ${product.title} from cart`} disabled={pending} onClick={onRemove} className="col-start-2 row-start-1 flex size-10 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100 disabled:opacity-50 sm:col-auto sm:row-auto"><RiDeleteBinLine aria-hidden="true" className="size-4.5" /></button>
    </article>
  );
}
