import { cookies } from "next/headers";
import { getWishlist } from "@/src/app/wishlist/wishlist.api";
import { getCart } from "@/src/app/cart/cart.api";
import { getTotalCartQuantity } from "@/src/app/cart/cart.interface";
import { Navbar } from "@/src/components/Navbar/Navbar";

export async function NavbarSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userName = cookieStore.get("user_name")?.value ?? "";
  let wishlistCount = 0;
  let cartCount = 0;

  if (token) {
    const [wishlistResult, cartResult] = await Promise.allSettled([getWishlist(), getCart()]);
    if (wishlistResult.status === "fulfilled") {
      wishlistCount = wishlistResult.value.count ?? wishlistResult.value.data?.length ?? 0;
    }
    if (cartResult.status === "fulfilled") {
      cartCount = getTotalCartQuantity(cartResult.value);
    }
  }

  return <Navbar userName={userName} wishlistCount={wishlistCount} cartCount={cartCount} isAuthenticated={Boolean(token)} />;
}


