"use server";

import { addCartProduct, applyCartCoupon as sendCartCoupon, clearCart, getCart, removeCartProduct, updateCartProduct } from "./cart.api";
import type { cartResponse } from "./cart.interface";

async function resolveMutationCart(result: cartResponse): Promise<cartResponse> {
  if (result?.data && Array.isArray(result.data.products)) return result;
  return getCart();
}

export async function addProductToCart(productId: string): Promise<cartResponse> {
  if (!productId) throw new Error("A product is required.");
  return resolveMutationCart(await addCartProduct(productId));
}

export async function updateCartQuantity(productId: string, count: number): Promise<cartResponse> {
  if (!productId || !Number.isInteger(count) || count < 1) throw new Error("A valid quantity is required.");
  return resolveMutationCart(await updateCartProduct(productId, count));
}

export async function removeProductFromCart(productId: string): Promise<cartResponse> {
  if (!productId) throw new Error("A product is required.");
  return resolveMutationCart(await removeCartProduct(productId));
}

export async function emptyCart(): Promise<cartResponse> {
  return resolveMutationCart(await clearCart());
}

export async function applyCartCoupon(coupon: string): Promise<cartResponse> {
  const normalizedCoupon = coupon.trim();
  if (!normalizedCoupon) throw new Error("Enter a coupon code first.");
  return resolveMutationCart(await sendCartCoupon(normalizedCoupon));
}
