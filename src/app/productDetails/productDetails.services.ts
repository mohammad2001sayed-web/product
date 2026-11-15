import type { ProductDetailsResponse } from "./productDetails.interface";

export async function getProductDetails(productId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");

  const response = await fetch(new URL(`/api/v1/products/${encodeURIComponent(productId)}`, baseUrl), {
    method: "GET",
    cache: "no-store",
  });
  if (!response.ok) {
    const error = new Error(`Loading product details failed (${response.status}).`);
    Object.assign(error, { status: response.status });
    throw error;
  }
  const data = await response.json() as ProductDetailsResponse;
  if (!data?.data) throw new Error("The product details API returned an invalid response.");
  return data.data;
}
