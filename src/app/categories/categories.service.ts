import { cacheLife } from "next/cache";

export type NavbarCategoryLink = {
  label: string;
  href: string;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

type CategoriesResponse = {
  data?: Category[];
};

const categoryLabels = ["Electronics", "Women's Fashion", "Men's Fashion", "Beauty & Health"];

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");

  const response = await fetch(new URL("/api/v1/categories", baseUrl));
  if (!response.ok) {
    throw new Error(`Loading categories failed (${response.status} ${response.statusText}).`);
  }

  const categories = (await response.json()) as CategoriesResponse;
  if (!Array.isArray(categories.data)) {
    throw new Error("The categories API returned an invalid response.");
  }

  return categories.data;
}

export async function getNavbarCategoryLinks(): Promise<NavbarCategoryLink[]> {
  "use cache";
  cacheLife("hours");

  const fallback = categoryLabels.map((label) => ({ label, href: "/shop" }));
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
    if (!baseUrl) return fallback;

    const response = await fetch(new URL("/api/v1/categories", baseUrl));
    if (!response.ok) return fallback;

    const categories = (await response.json()) as CategoriesResponse;
    if (!Array.isArray(categories.data)) return fallback;

    return categoryLabels.map((label) => {
      const category = categories.data?.find(
        (item) => item.name.trim().toLocaleLowerCase() === label.toLocaleLowerCase(),
      );
      return {
        label,
        href: category?._id ? `/shop?category=${encodeURIComponent(category._id)}` : "/shop",
      };
    });
  } catch {
    return fallback;
  }
}
