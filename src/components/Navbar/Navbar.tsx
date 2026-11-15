"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import freshCartLogo from "../../assets/imgi_1_freshcart-logo.49f1b44d.png";
import { logout } from "@/src/app/account/logout.actions";
import {
  RiArrowDownSLine,
  RiCloseLine,
  RiGiftLine,
  RiHeartLine,
  RiMailLine,
  RiMenuLine,
  RiPhoneLine,
  RiSearchLine,
  RiShoppingCartLine,
  RiTruckLine,
  RiUserLine,
  RiWhatsappLine,
} from "@remixicon/react";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories", hasMenu: true },
  { label: "Brands", href: "/brands" },
];

const categories = [
  { label: "All Categories", href: "/categories" },
  { label: "Electronics", href: "/categories?category=electronics" },
  { label: "Women's Fashion", href: "/categories?category=womens-fashion" },
  { label: "Men's Fashion", href: "/categories?category=mens-fashion" },
  { label: "Beauty & Health", href: "/categories?category=beauty-health" },
];

const mobileActionLinks = [
  { label: "Wishlist", href: "/wishlist", Icon: RiHeartLine },
  { label: "Cart", href: "/cart", Icon: RiShoppingCartLine },
];

type NavbarProps = { userName?: string; wishlistCount?: number; cartCount?: number; isAuthenticated?: boolean };

export function Navbar({ userName = "", wishlistCount: initialWishlistCount = 0, cartCount: initialCartCount = 0, isAuthenticated = Boolean(userName) }: NavbarProps = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(initialWishlistCount);
  const [cartCount, setCartCount] = useState(initialCartCount);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  useEffect(() => {
    setWishlistCount(initialWishlistCount);
    function handleWishlistCount(event: Event) {
      const count = (event as CustomEvent<number>).detail;
      if (typeof count === "number") setWishlistCount(count);
    }
    window.addEventListener("wishlist-count-change", handleWishlistCount);
    return () => window.removeEventListener("wishlist-count-change", handleWishlistCount);
  }, [initialWishlistCount]);

  useEffect(() => {
    setCartCount(initialCartCount);
    function handleCartCount(event: Event) {
      const count = (event as CustomEvent<number>).detail;
      if (typeof count === "number") setCartCount(count);
    }
    window.addEventListener("cart-count-change", handleCartCount);
    return () => window.removeEventListener("cart-count-change", handleCartCount);
  }, [initialCartCount]);
  useEffect(() => {
    if (!menuOpen) return;

    const previouslyFocused = document.activeElement;
    const menu = menuRef.current;
    const focusableSelector = 'a[href], button:not([disabled])';
    const previousBodyOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    menu?.querySelector<HTMLElement>(focusableSelector)?.focus();
    document.body.style.overflow = "hidden";

    function handleBreakpointChange(event: MediaQueryListEvent) {
      if (event.matches) {
        setMenuOpen(false);
        setCategoriesOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCategoriesOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !menu) return;
      const focusableItems = Array.from(menu.querySelectorAll<HTMLElement>(focusableSelector));
      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem?.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleBreakpointChange);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleBreakpointChange);
      document.body.style.overflow = previousBodyOverflow;
      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected &&
        previouslyFocused.getClientRects().length > 0
      ) {
        previouslyFocused.focus();
      }
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    setCategoriesOpen(false);
  }

  return (
    <>
      <div className="hidden border-b border-gray-100 bg-gray-50/80 text-xs text-gray-600 lg:block">
        <div className="mx-auto flex h-9 max-w-[1880px] items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <RiTruckLine aria-hidden="true" className="size-4 text-[#16a34a]" />
              Free Shipping on Orders 500 EGP
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <RiGiftLine aria-hidden="true" className="size-4 text-[#16a34a]" />
              New Arrivals Daily
            </span>
          </div>
          <div className="flex items-center gap-5 whitespace-nowrap">
            <a className="inline-flex items-center gap-1.5 transition-colors hover:text-[#16a34a]" href="tel:+18001234567">
              <RiPhoneLine aria-hidden="true" className="size-3.5" />
              +1 (800) 123-4567
            </a>
            <a className="inline-flex items-center gap-1.5 transition-colors hover:text-[#16a34a]" href="mailto:support@freshcart.com">
              <RiMailLine aria-hidden="true" className="size-3.5" />
              support@freshcart.com
            </a>
            <span aria-hidden="true" className="h-4 w-px bg-gray-200" />
            {isAuthenticated ? (
              <span className="font-medium text-slate-700">Hello, {userName || "there"}</span>
            ) : (
              <>
                <Link className="transition-colors hover:text-[#16a34a]" href="/account">Sign In</Link>
                <Link className="transition-colors hover:text-[#16a34a]" href="/account/register">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full bg-white text-gray-900 shadow-sm">
          <div className="mx-auto flex h-16 max-w-[1880px] items-center justify-between gap-3 px-4 lg:h-17 lg:gap-6">
          <Link href="/" aria-label="FreshCart home" className="group flex shrink-0 items-center">
            <Image
              src={freshCartLogo}
              alt="FreshCart"
              priority
              width={145}
              height={30}
              className="h-auto w-32 sm:w-36.25"
            />
          </Link>

          <form action="/" role="search" className="hidden min-w-0 max-w-2xl flex-1 lg:flex">
            <div className="relative w-full">
              <input
                aria-label="Search products"
                name="q"
                placeholder="Search for products, brands and more..."
                className="h-11 w-full rounded-full border border-gray-200 bg-gray-50/50 py-3 pl-5 pr-14 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#16a34a] focus:bg-white focus:ring-2 focus:ring-[#16a34a]/20"
              />
              <button type="submit" aria-label="Search" className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#16a34a] text-white transition-colors hover:bg-[#15803d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2">
                <RiSearchLine aria-hidden="true" className="size-4" />
              </button>
            </div>
          </form>

          <nav aria-label="Main navigation" className="hidden shrink-0 items-center gap-6 xl:flex">
            {navigationLinks.map(({ label, href, hasMenu }) => hasMenu ? (
              <div key={label} className="relative" onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setCategoriesOpen(false);
              }}>
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={categoriesOpen}
                  onClick={() => setCategoriesOpen((open) => !open)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setCategoriesOpen(true);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 py-2 font-medium text-gray-700 transition-colors hover:text-[#16a34a] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]"
                >
                  {label}<RiArrowDownSLine aria-hidden="true" className="size-4" />
                </button>
                {categoriesOpen ? (
                  <div className="absolute left-0 top-full z-50 mt-1 min-w-50 rounded-xl border border-gray-100 bg-white py-2 shadow-xl" aria-label="Category links">
                    {categories.map((category) => (
                      <Link key={category.label} href={category.href} onClick={() => setCategoriesOpen(false)} className="block px-4 py-2.5 text-gray-600 transition-colors hover:bg-[#f0fdf4] hover:text-[#16a34a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#16a34a]">
                        {category.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <Link key={label} href={href} className="font-medium text-gray-700 transition-colors hover:text-[#16a34a] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 lg:gap-2">
            <Link href="/support" aria-label="Contact support" className="hidden items-center gap-2 border-r border-gray-200 pr-3 transition-opacity hover:opacity-80 lg:flex">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#f0fdf4] text-[#16a34a]">
                <RiWhatsappLine aria-hidden="true" className="size-5" />
              </span>
              <span className="text-xs">
                <span className="block text-gray-400">Support</span>
                <span className="block font-semibold text-gray-700">24/7 Help</span>
              </span>
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]">
              <RiHeartLine aria-hidden="true" className="size-5 text-gray-600 group-hover:text-[#16a34a]" />
              {wishlistCount > 0 ? <span aria-label={`${wishlistCount} ${wishlistCount === 1 ? "item" : "items"}`} className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-[#16a34a] px-1 text-[10px] font-bold leading-5 text-white">{wishlistCount}</span> : null}
            </Link>
            <Link href="/cart" aria-label="Shopping cart" className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]">
              <RiShoppingCartLine aria-hidden="true" className="size-5 text-gray-600 group-hover:text-[#16a34a]" />
              {cartCount > 0 ? <span aria-label={`${cartCount} ${cartCount === 1 ? "item" : "items"}`} className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-[#16a34a] px-1 text-[10px] font-bold leading-5 text-white">{cartCount}</span> : null}
            </Link>
            {isAuthenticated ? (
              <form action={logout} className="ml-2 hidden lg:block">
                <button type="submit" className="rounded-full bg-[#16a34a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#15803d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2">Logout</button>
              </form>
            ) : (
              <Link href="/account" aria-label="Sign in" className="ml-2 hidden items-center gap-2 rounded-full bg-[#16a34a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#15803d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2 lg:flex">
                <RiUserLine aria-hidden="true" className="size-4" /> Sign In
              </Link>
            )}
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="ml-1 flex size-10 items-center justify-center rounded-full bg-[#16a34a] text-white transition-colors hover:bg-[#15803d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2 lg:hidden"
            >
              {menuOpen ? <RiCloseLine aria-hidden="true" className="size-5" /> : <RiMenuLine aria-hidden="true" className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-50 transition-[visibility] duration-300 lg:hidden ${menuOpen ? "visible" : "invisible pointer-events-none"}`}>
        <button type="button" tabIndex={-1} aria-label="Close navigation menu" onClick={closeMenu} className={`absolute inset-0 size-full bg-black/50 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`} />
        <aside
          id="mobile-navigation"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          className={`absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <Link href="/" onClick={closeMenu} aria-label="FreshCart home" className="flex items-center">
              <Image src={freshCartLogo} alt="FreshCart" width={135} height={28} className="h-auto w-33.75" />
            </Link>
            <button type="button" aria-label="Close navigation menu" onClick={closeMenu} className="flex size-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]">
              <RiCloseLine aria-hidden="true" className="size-5" />
            </button>
          </div>

          <form action="/" role="search" className="mx-4 mt-4">
            <div className="relative">
              <input aria-label="Search products" name="q" placeholder="Search products..." className="h-11 w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-4 pr-12 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#16a34a] focus:bg-white focus:ring-2 focus:ring-[#16a34a]/20" />
              <button type="submit" aria-label="Search" className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#16a34a] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]"><RiSearchLine aria-hidden="true" className="size-4" /></button>
            </div>
          </form>

          <nav aria-label="Mobile main navigation" className="mt-4 border-y border-gray-100 p-4">
            {navigationLinks.map(({ label, href, hasMenu }) => hasMenu ? (
              <div key={label}>
                <button type="button" aria-expanded={categoriesOpen} onClick={() => setCategoriesOpen((open) => !open)} className="flex min-h-12 w-full items-center justify-between rounded-lg px-3 text-left font-medium text-gray-700 transition-colors hover:bg-[#f0fdf4] hover:text-[#16a34a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#16a34a]">
                  {label}<RiArrowDownSLine aria-hidden="true" className={`size-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
                </button>
                {categoriesOpen ? (
                  <div className="mb-2 ml-3 border-l-2 border-[#86efac] pl-2">
                    {categories.map((category) => <Link key={category.label} href={category.href} onClick={closeMenu} className="flex min-h-10 items-center rounded-lg px-3 text-sm text-gray-600 transition-colors hover:bg-[#f0fdf4] hover:text-[#16a34a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#16a34a]">{category.label}</Link>)}
                  </div>
                ) : null}
              </div>
            ) : (
              <Link key={label} href={href} onClick={closeMenu} className="flex min-h-12 items-center rounded-lg px-3 font-medium text-gray-700 transition-colors hover:bg-[#f0fdf4] hover:text-[#16a34a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#16a34a]">{label}</Link>
            ))}
          </nav>

          <nav aria-label="Wishlist and cart" className="border-b border-gray-100 p-4">
            {mobileActionLinks.map(({ label, href, Icon }) => (
              <Link key={label} href={href} onClick={closeMenu} className="flex min-h-12 items-center gap-3 rounded-lg px-3 font-medium text-gray-700 transition-colors hover:bg-[#f0fdf4] hover:text-[#16a34a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#16a34a]">
                <span className="relative"><Icon aria-hidden="true" className="size-5" />{label === "Wishlist" && wishlistCount > 0 ? <span aria-label={`${wishlistCount} saved`} className="absolute -right-3 -top-2 rounded-full bg-[#16a34a] px-1.5 text-[10px] font-bold leading-4 text-white">{wishlistCount}</span> : null}{label === "Cart" && cartCount > 0 ? <span aria-label={`${cartCount} items`} className="absolute -right-3 -top-2 rounded-full bg-[#16a34a] px-1.5 text-[10px] font-bold leading-4 text-white">{cartCount}</span> : null}</span>{label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto p-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <p className="px-2 text-sm font-semibold text-slate-700">Hello, {userName || "there"}</p>
                <form action={logout}><button type="submit" onClick={closeMenu} className="flex min-h-11 w-full items-center justify-center rounded-full bg-[#16a34a] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#15803d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2">Logout</button></form>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/account" onClick={closeMenu} className="flex min-h-11 items-center justify-center rounded-full bg-[#16a34a] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#15803d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2">Sign In</Link>
                <Link href="/account/register" onClick={closeMenu} className="flex min-h-11 items-center justify-center rounded-full border border-[#16a34a] px-3 text-sm font-semibold text-[#16a34a] transition-colors hover:bg-[#f0fdf4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2">Sign Up</Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}






