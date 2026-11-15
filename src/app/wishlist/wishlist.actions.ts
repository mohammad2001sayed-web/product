"use server";

import { revalidatePath } from "next/cache";
import { getWishlist, postWishlist, deleteWishlist } from "./wishlist.api";

export async function setWishlistItem(productId: string, shouldBeSaved: boolean): Promise<number> {
  if (!productId) throw new Error("A product is required.");
  if (shouldBeSaved) await postWishlist(productId);
  else await deleteWishlist(productId);

  const wishlist = await getWishlist();
  const count = wishlist.count ?? wishlist.data?.length ?? 0;
  revalidatePath("/", "layout");
  return count;
}
