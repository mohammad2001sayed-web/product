"use server";

import { readNavbarState } from "./navbar.data";
import type { NavbarSnapshot } from "@/src/components/Navbar/NavbarEvents";

export async function getNavbarState(): Promise<NavbarSnapshot> {
  return readNavbarState();
}
