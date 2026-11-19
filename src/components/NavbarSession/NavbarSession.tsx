import { Navbar } from "@/src/components/Navbar/Navbar";
import { readNavbarState } from "./navbar.data";
import { getNavbarCategoryLinks } from "@/src/app/categories/categories.service";

export async function NavbarSession() {
  const [snapshot, categoryLinks] = await Promise.all([readNavbarState(), getNavbarCategoryLinks()]);
  return <Navbar {...snapshot} categoryLinks={categoryLinks} key={`${snapshot.userName}:${snapshot.wishlistCount}:${snapshot.cartCount}`} />;
}

export function NavbarSessionFallback() {
  return <Navbar />;
}

