import type { AllProductsResponse, Product } from "./home.interface";
import { cacheLife } from "next/cache";

async function fetchProductsPage(baseUrl: string, page: number, category?: string): Promise<AllProductsResponse> {
  "use cache";
  cacheLife("minutes");

  const url = new URL("/api/v1/products", baseUrl);
  url.searchParams.set("page", String(page));
  if (category) url.searchParams.set("category[in]", category);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Loading products failed (${response.status} ${response.statusText}).`);
  }

  return response.json() as Promise<AllProductsResponse>;
}

export async function getProductsPage(page = 1, category?: string, keyword?: string): Promise<AllProductsResponse> {
  "use cache";
  cacheLife("minutes");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
  }

  const normalizedKeyword = keyword?.trim().toLocaleLowerCase();
  const result = await fetchProductsPage(baseUrl, normalizedKeyword ? 1 : page, category);
  if (!Array.isArray(result.data)) {
    throw new Error("The products API returned an invalid response.");
  }
  if (!normalizedKeyword) return result;

  const apiPageCount = Math.max(1, result.metadata?.numberOfPages ?? 1);
  const remainingPages = await Promise.all(
    Array.from({ length: apiPageCount - 1 }, (_, index) => fetchProductsPage(baseUrl, index + 2, category)),
  );
  const matches = [...result.data, ...remainingPages.flatMap((pageResult) => pageResult.data ?? [])].filter((product) =>
    product.title.toLocaleLowerCase().includes(normalizedKeyword),
  );
  const limit = result.metadata?.limit ?? 40;
  const numberOfPages = Math.max(1, Math.ceil(matches.length / limit));
  const currentPage = Math.min(page, numberOfPages);

  return {
    ...result,
    results: matches.length,
    metadata: {
      ...result.metadata,
      currentPage,
      numberOfPages,
      limit,
      nextPage: currentPage < numberOfPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
    },
    data: matches.slice((currentPage - 1) * limit, currentPage * limit),
  };
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
