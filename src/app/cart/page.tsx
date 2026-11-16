import { Suspense } from "react";
import { getAuthToken } from "@/src/next-Auth/getAuthToken";
import { getCart } from "./cart.api";
import type { cartResponse } from "./cart.interface";
import { CartView } from "@/src/components/CartView/CartView";

export default function CartPage() {
  return <Suspense fallback={<CartLoading />}><CartContent /></Suspense>;
}

async function CartContent() {
  const token = await getAuthToken();
  let cart: cartResponse | null = null;
  let loadError = false;
  if (token) {
    try {
      cart = await getCart();
    } catch {
      loadError = true;
    }
  }
  return <CartView initialCart={cart} isAuthenticated={Boolean(token)} loadError={loadError} />;
}

function CartLoading() {
  return <main aria-label="Loading cart" className="min-h-[60vh] flex-1 bg-[#f8f9fc]"><div className="mx-auto max-w-360 animate-pulse px-4 py-10 sm:px-6 lg:px-8"><div className="mb-8 h-16 w-72 rounded-xl bg-slate-200" /><div className="grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(300px,0.9fr)]"><div className="h-72 rounded-2xl bg-white" /><div className="h-96 rounded-2xl bg-white" /></div></div></main>;
}
