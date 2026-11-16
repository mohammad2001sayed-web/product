import { cache } from "react";
import { getAuthToken } from "@/src/next-Auth/getAuthToken";
import type { WishlistResponse } from "./wishlist.interface";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.trim();

async function wishlistRequest(method: "GET" | "POST" | "DELETE", productId?: string): Promise<WishlistResponse> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
  const token = await getAuthToken();
  if (!token) throw new Error("Please sign in to access your wishlist.");
  
  const url = productId && method === "DELETE"
  ? new URL(`/api/v1/wishlist/${encodeURIComponent(productId)}`, BASE_URL)
  : new URL("/api/v1/wishlist", BASE_URL);
  const response = await fetch(url, {
      method,
      headers: {
          token,
          ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
        },
        ...(method === "POST" ? { body: JSON.stringify({ productId }) } : {}),
        cache: "no-store",
    });
//    console.log(productId);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to update wishlist.");
  return data as WishlistResponse;
}

const readWishlist = cache(() => wishlistRequest("GET"));

export function getWishlist(): Promise<WishlistResponse> {
  return readWishlist();
}

export function postWishlist(productId: string): Promise<WishlistResponse> {
  return wishlistRequest("POST", productId);
}

export function deleteWishlist(productId: string): Promise<WishlistResponse> {
  return wishlistRequest("DELETE", productId);
}
