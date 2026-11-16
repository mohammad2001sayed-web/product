import { getAuthToken } from "@/src/next-Auth/getAuthToken";
import type { cartResponse } from "./cart.interface";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.trim() || "https://ecommerce.routemisr.com";

async function cartRequest(path: string, method: "GET" | "POST" | "PUT" | "DELETE", body?: object): Promise<cartResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Please sign in to access your cart.");

  let response: Response;
  try {
    response = await fetch(new URL(path, BASE_URL), {
      method,
      headers: {
        token,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
  } catch (cause) {
    if (cause instanceof Error && cause.name === "TimeoutError") {
      throw new Error("The cart server took too long to respond. Please try again.");
    }
    throw cause;
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to update your cart.");
  return data as cartResponse;
}

export function getCart(): Promise<cartResponse> {
  return cartRequest("/api/v2/cart", "GET");
}

export function addCartProduct(productId: string): Promise<cartResponse> {
  return cartRequest("/api/v2/cart", "POST", { productId });
}

export function updateCartProduct(productId: string, count: number): Promise<cartResponse> {
  return cartRequest(`/api/v2/cart/${encodeURIComponent(productId)}`, "PUT", { count });
}

export function removeCartProduct(productId: string): Promise<cartResponse> {
  return cartRequest(`/api/v2/cart/${encodeURIComponent(productId)}`, "DELETE");
}

export function clearCart(): Promise<cartResponse> {
  return cartRequest("/api/v2/cart", "DELETE");
}

export function applyCartCoupon(coupon: string): Promise<cartResponse> {
  return cartRequest("/api/v2/cart/applyCoupon", "PUT", { coupon });
}

