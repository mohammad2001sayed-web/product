import type { AllProductsResponse, Product } from "./home.interface";

async function getProductsPage(baseUrl: string, page: number): Promise<AllProductsResponse> {
  const url = new URL("/api/v1/products", baseUrl);
  url.searchParams.set("page", String(page));

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Loading products failed (${response.status} ${response.statusText}).`);
  }

  return response.json() as Promise<AllProductsResponse>;
}

export async function getProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
  }

  const firstPage = await getProductsPage(baseUrl, 1);
  if (!Array.isArray(firstPage.data)) {
    throw new Error("The products API returned an invalid response.");
  }

  const totalPages = Math.max(1, firstPage.metadata?.numberOfPages ?? 1);
  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getProductsPage(baseUrl, index + 2),
    ),
  );

  const allProducts = [firstPage, ...remainingPages].flatMap((page) => page.data);
  return Array.from(new Map(allProducts.map((product) => [product.id || product._id, product])).values());
}

export async function getProductsByBrand(brandId: string): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
  }

  const url = new URL("/api/v1/products", baseUrl);
  url.searchParams.set("brand", brandId);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Loading brand products failed (${response.status} ${response.statusText}).`);
  }

  const data = (await response.json()) as AllProductsResponse;
  if (!Array.isArray(data.data)) {
    throw new Error("The products API returned an invalid response.");
  }

  return data.data;
}
