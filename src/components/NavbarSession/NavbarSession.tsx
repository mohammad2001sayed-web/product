import { Navbar } from "@/src/components/Navbar/Navbar";
import { readNavbarState } from "./navbar.data";

export async function NavbarSession() {
  const snapshot = await readNavbarState();
  return <Navbar {...snapshot} key={`${snapshot.userName}:${snapshot.wishlistCount}:${snapshot.cartCount}`} />;
}

export function NavbarSessionFallback() {
  return <Navbar />;
}

