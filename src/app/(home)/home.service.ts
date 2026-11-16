import type { AllProductsResponse, Product } from "./home.interface";
import { cacheLife } from "next/cache";

async function fetchProductsPage(baseUrl: string, page: number): Promise<AllProductsResponse> {
  "use cache";
  cacheLife("minutes");

  const url = new URL("/api/v1/products", baseUrl);
  url.searchParams.set("page", String(page));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Loading products failed (${response.status} ${response.statusText}).`);
  }

  return response.json() as Promise<AllProductsResponse>;
}

export async function getProductsPage(page = 1): Promise<AllProductsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
  }

  const result = await fetchProductsPage(baseUrl, page);
  if (!Array.isArray(result.data)) {
    throw new Error("The products API returned an invalid response.");
  }
  return result;
}

export async function getProductsByBrand(brandId: string): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
  }

  const url = new URL("/api/v1/products", baseUrl);
  url.searchParams.set("brand", brandId);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Loading brand products failed (${response.status} ${response.statusText}).`);
  }

  const data = (await response.json()) as AllProductsResponse;
  if (!Array.isArray(data.data)) {
    throw new Error("The products API returned an invalid response.");
  }

  return data.data;
}
