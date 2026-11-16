import { getCart } from "@/src/app/cart/cart.api";
import { getTotalCartQuantity } from "@/src/app/cart/cart.interface";
import { getWishlist } from "@/src/app/wishlist/wishlist.api";
import { getAuthSession } from "@/src/next-Auth/getAuthSession";
import { getAuthToken } from "@/src/next-Auth/getAuthToken";
import type { NavbarSnapshot } from "@/src/components/Navbar/NavbarEvents";

export async function readNavbarState(): Promise<NavbarSnapshot> {
  const [session, token] = await Promise.all([getAuthSession(), getAuthToken()]);
  const snapshot: NavbarSnapshot = {
    userName: session?.user.name ?? "",
    isAuthenticated: Boolean(token),
    wishlistCount: 0,
    cartCount: 0,
  };

  if (!token) return snapshot;

  const [wishlistResult, cartResult] = await Promise.allSettled([getWishlist(), getCart()]);
  if (wishlistResult.status === "fulfilled") {
    snapshot.wishlistCount = wishlistResult.value.count ?? wishlistResult.value.data?.length ?? 0;
  }
  if (cartResult.status === "fulfilled") {
    snapshot.cartCount = getTotalCartQuantity(cartResult.value);
  }

  return snapshot;
}
