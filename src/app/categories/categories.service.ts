import { cacheLife } from "next/cache";

export type NavbarCategoryLink = {
  label: string;
  href: string;
};

type ApiCategory = {
  _id: string;
  name: string;
};

type CategoriesResponse = {
  data?: ApiCategory[];
};

const categoryLabels = ["Electronics", "Women's Fashion", "Men's Fashion", "Beauty & Health"];

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
