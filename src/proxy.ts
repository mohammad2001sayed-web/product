import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPages = ["/wishlist", "/cart", "/orders", "/profile"];
const authPages = ["/account"];

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const myToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const isLoggedIn = Boolean(myToken?.token);

  if (!isLoggedIn && protectedPages.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/account", req.nextUrl));
  }
  if (isLoggedIn && authPages.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/wishlist/:path*",
    "/cart/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/account/:path*",
  ],
};