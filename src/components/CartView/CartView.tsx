"use client";

import Link from "next/link";
import { useState } from "react";
import {
  RiArrowLeftLine,
  RiDeleteBinLine,
  RiHeartLine,
  RiShieldCheckLine,
  RiShoppingCartLine,
  RiTruckLine,
} from "@remixicon/react";
import {
  applyCartCoupon,
  emptyCart,
  removeProductFromCart,
  updateCartQuantity,
} from "@/src/app/cart/cart.actions";
import type { cartResponse } from "@/src/app/cart/cart.interface";
import { getTotalCartQuantity } from "@/src/app/cart/cart.interface";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "@/src/components/CartItemRow/CartItemRow";
import { EmptyCart } from "@/src/components/EmptyCart/EmptyCart";

const money = (value: number) =>
  `${new Intl.NumberFormat("en-EG", { maximumFractionDigits: 2 }).format(value)} EGP`;

export function CartView({
  initialCart,
  isAuthenticated,
  loadError,
}: {
  initialCart: cartResponse | null;
  isAuthenticated: boolean;
  loadError: boolean;
}) {
  const [cart, setCart] = useState(initialCart);
  const [pendingId, setPendingId] = useState("");
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const items = cart?.data.products ?? [];
  const count = getTotalCartQuantity(cart);
  const subtotal =
    cart?.data.totalCartPrice ??
    items.reduce((sum, item) => sum + item.price * item.count, 0);
  const total = cart?.data.totalAfterDiscount ?? subtotal;
  const discountAmount = Math.max(0, subtotal - total);

  async function applyChange(
    action: () => Promise<cartResponse>,
    id = "cart",
    optimisticUpdate?: (current: cartResponse) => cartResponse,
  ) {
    const previousCart = cart;
    setPendingId(id);
    setError("");
    if (previousCart && optimisticUpdate) {
      const optimisticCart = optimisticUpdate(previousCart);
      setCart(optimisticCart);
      window.dispatchEvent(new CustomEvent("cart-count-change", { detail: getTotalCartQuantity(optimisticCart) }));
    }
    try {
      const updated = await action();
      setCart(updated);
      window.dispatchEvent(
        new CustomEvent("cart-count-change", {
          detail: getTotalCartQuantity(updated),
        }),
      );
    } catch (cause) {
      if (previousCart && optimisticUpdate) {
        setCart(previousCart);
        window.dispatchEvent(new CustomEvent("cart-count-change", { detail: getTotalCartQuantity(previousCart) }));
      }
      setError(
        cause instanceof Error ? cause.message : "Unable to update your cart.",
      );
    } finally {
      setPendingId("");
    }
  }

  return (
    <main className="min-h-[60vh] flex-1 bg-[#f8f9fc]">
      <div className="mx-auto w-full max-w-360 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
          <Link href="/" className="transition-colors hover:text-[#16a34a]">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span className="text-slate-800">Shopping Cart</span>
        </nav>
        <header className="mb-8 flex items-center gap-4 sm:mb-10">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#16a34a] text-white shadow-sm sm:size-16">
            <RiShoppingCartLine
              aria-hidden="true"
              className="size-7 sm:size-8"
            />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              You have{" "}
              <span className="font-semibold text-[#16a34a]">
                {count} {count === 1 ? "item" : "items"}
              </span>{" "}
              in your cart
            </p>
          </div>
        </header>

        {loadError ? (
          <section
            role="alert"
            className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              We couldn’t load your cart
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {error || "Please try again in a moment."}
            </p>
          </section>
        ) : !isAuthenticated ? (
          <EmptyCart signedOut />
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(300px,0.9fr)] lg:gap-8">
            <section aria-label="Cart items" className="min-w-0">
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                {items.map((item) => (
                  <CartItemRow
                    key={item._id || item.product._id}
                    item={item}
                    pending={pendingId === item.product._id}
                    onQuantity={(count) =>
                      applyChange(
                        () => updateCartQuantity(item.product._id, count),
                        item.product._id,
                    (current) => {
                      const products = current.data.products.map((cartItem) =>
                        cartItem.product._id === item.product._id
                          ? { ...cartItem, count }
                          : cartItem,
                      );
                      const totalCartPrice = products.reduce((sum, cartItem) => sum + cartItem.price * cartItem.count, 0);
                      const optimisticCart = {
                        ...current,
                        data: { ...current.data, products, totalCartPrice, totalAfterDiscount: undefined },
                      };
                      return { ...optimisticCart, numOfCartItems: getTotalCartQuantity(optimisticCart) };
                    },
                      )
                    }
                    onRemove={() =>
                      applyChange(
                        () => removeProductFromCart(item.product._id),
                        item.product._id,
                      )
                    }
                  />
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-200 pt-5">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#16a34a] transition-colors hover:text-[#128c3f]"
                >
                  <RiArrowLeftLine aria-hidden="true" className="size-4" />{" "}
                  Continue Shopping
                </Link>
                <button
                  type="button"
                  disabled={Boolean(pendingId)}
                  onClick={() => applyChange(emptyCart)}
                  className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-rose-600 disabled:opacity-50"
                >
                  <RiDeleteBinLine aria-hidden="true" className="size-4" />{" "}
                  Clear all items
                </button>
              </div>
              {error ? (
                <p role="alert" className="mt-4 text-sm text-rose-600">
                  {error}
                </p>
              ) : null}
            </section>

            <aside
              aria-label="Order summary"
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              <h2 className="bg-[#111827] px-6 py-5 text-xl font-bold text-white">
                Order Summary
              </h2>
              <div className="space-y-5 p-6">
                <div className="flex justify-between gap-4 text-sm text-slate-600">
                  <span>
                    Subtotal ({count} {count === 1 ? "item" : "items"})
                  </span>
                  <span className="font-semibold text-slate-800">
                    {money(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-5 text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className="text-[#16a34a]">Calculated at checkout</span>
                </div>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setCouponMessage("");
                    void applyChange(async () => {
                      const updated = await applyCartCoupon(coupon);
                      setCouponMessage("Coupon applied successfully.");
                      return updated;
                    }, "coupon");
                  }}
                  className="space-y-2"
                >
                  <label htmlFor="cart-coupon" className="text-sm font-medium text-slate-700">Discount code</label>
                  <div className="flex gap-2">
                    <input
                      id="cart-coupon"
                      value={coupon}
                      onChange={(event) => setCoupon(event.target.value)}
                      placeholder="Enter coupon code"
                      autoComplete="off"
                      disabled={Boolean(pendingId)}
                      className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/15 disabled:bg-slate-50"
                    />
                    <Button type="submit" variant="outline" disabled={Boolean(pendingId) || !coupon.trim()} className="h-10 border-[#16a34a] px-3 text-sm font-semibold text-[#15803d] hover:bg-green-50">Apply</Button>
                  </div>
                  {couponMessage ? <p role="status" className="text-xs text-emerald-700">{couponMessage}</p> : null}
                </form>
                {discountAmount > 0 ? (
                  <div className="flex justify-between gap-4 text-sm text-emerald-700">
                    <span>Discount</span><span className="font-semibold">−{money(discountAmount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4 text-base font-bold text-slate-700">
                  <span>Estimated Total</span>
                  <span className="text-[#16a34a]">{money(total)}</span>
                </div>
                <Link
                  href={isAuthenticated ? "/checkout" : "/account"}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#128c3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2"
                >
                  {isAuthenticated
                    ? "Proceed to Checkout"
                    : "Login to Checkout"}
                </Link>
                {!isAuthenticated ? (
                  <p className="text-center text-xs text-slate-400">
                    Don’t have an account?{" "}
                    <Link
                      href="/account/register"
                      className="font-semibold text-[#16a34a]"
                    >
                      Sign up
                    </Link>
                  </p>
                ) : null}
                <div className="space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <p className="flex items-center gap-2">
                    <RiTruckLine
                      aria-hidden="true"
                      className="size-4 text-[#16a34a]"
                    />{" "}
                    Free shipping on orders over 500 EGP
                  </p>
                  <p className="flex items-center gap-2">
                    <RiShieldCheckLine
                      aria-hidden="true"
                      className="size-4 text-[#16a34a]"
                    />{" "}
                    Secure checkout
                  </p>
                  <p className="flex items-center gap-2">
                    <RiHeartLine
                      aria-hidden="true"
                      className="size-4 text-[#16a34a]"
                    />{" "}
                    Your cart is saved to your account
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
