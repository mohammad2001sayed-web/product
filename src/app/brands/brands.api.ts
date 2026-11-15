import { BrandsResponse } from "./brands.interface";

export async function getBrands(): Promise<BrandsResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/brands`);

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to fetch brands.");
    
    return data;


}