import type { Product } from "@/src/app/(home)/home.interface";

export interface WishlistResponse {
  statusMsg?: string;
  message?: string;
  count?: number;
  data?: Product[];
}
