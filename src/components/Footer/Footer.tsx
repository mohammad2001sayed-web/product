import Link from "next/link";
import Image from "next/image";
import freshCartLogo from "../../assets/imgi_1_freshcart-logo.49f1b44d.png";
import { RiFacebookFill, RiInstagramLine, RiMailLine, RiMapPin2Line, RiPhoneLine, RiRefreshLine, RiShieldCheckLine, RiTruckLine, RiTwitterXLine, RiWhatsappLine } from "@remixicon/react";

const features = [
  { title: "Free Shipping", description: "On orders over 500 EGP", Icon: RiTruckLine },
  { title: "Easy Returns", description: "14-day return policy", Icon: RiRefreshLine },
  { title: "Secure Payment", description: "100% secure checkout", Icon: RiShieldCheckLine },
  { title: "24/7 Support", description: "Contact us anytime", Icon: RiWhatsappLine },
];

const groups = [
  { title: "Shop", links: [["All Products", "/shop"], ["Categories", "/categories"], ["Brands", "/brands"], ["Electronics", "/categories?category=electronics"], ["Men’s Fashion", "/categories?category=mens-fashion"], ["Women’s Fashion", "/categories?category=womens-fashion"]] },
  { title: "Account", links: [["My Account", "/account"], ["Order History", "/account/orders"], ["Wishlist", "/wishlist"], ["Shopping Cart", "/cart"], ["Sign In", "/account"], ["Create Account", "/account/register"]] },
  { title: "Support", links: [["Contact Us", "/support"], ["Help Center", "/support"], ["Shipping Info", "/support"], ["Returns & Refunds", "/support"], ["Track Order", "/account/orders"]] },
  { title: "Legal", links: [["Privacy Policy", "/support"], ["Terms of Service", "/support"], ["Cookie Policy", "/support"]] },
];

export function Footer() {
  return <>
    <section aria-label="FreshCart shopping features" className="border-y border-[#e2f2e8] bg-[#effbf4] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1880px] grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {features.map(({ title, description, Icon }) => <div key={title} className="flex min-w-0 items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#eaf7ef] text-[#168247]"><Icon aria-hidden="true" className="size-5" /></span><div><h2 className="text-sm font-bold text-[#18251e]">{title}</h2><p className="mt-0.5 text-xs text-slate-500">{description}</p></div></div>)}
      </div>
    </section>
    <footer className="bg-[#101827] text-white">
      <div className="mx-auto grid w-full max-w-[1880px] gap-9 px-4 py-9 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.55fr_repeat(4,1fr)] lg:gap-9 lg:px-8 lg:py-10">
        <div className="max-w-sm"><Link href="/" aria-label="FreshCart home" className="inline-flex rounded-md bg-white px-3 py-1.5"><Image src={freshCartLogo} alt="FreshCart" width={150} height={31} className="h-auto w-[138px]" /></Link><p className="mt-4 text-sm leading-6 text-white/65">FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.</p><ul className="mt-5 space-y-2.5 text-sm text-white/65"><li className="flex items-center gap-2"><RiPhoneLine aria-hidden="true" className="size-4 text-[#16c172]" /><a href="tel:+18001234567" className="hover:text-white">+1 (800) 123-4567</a></li><li className="flex items-center gap-2"><RiMailLine aria-hidden="true" className="size-4 text-[#16c172]" /><a href="mailto:support@freshcart.com" className="hover:text-white">support@freshcart.com</a></li><li className="flex items-center gap-2"><RiMapPin2Line aria-hidden="true" className="size-4 text-[#16c172]" /><span>123 Commerce Street, New York, NY 10001</span></li></ul><div className="mt-5 flex items-center gap-2"><a href="https://facebook.com" aria-label="Facebook" className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><RiFacebookFill className="size-4" /></a><a href="https://x.com" aria-label="Twitter" className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><RiTwitterXLine className="size-4" /></a><a href="https://instagram.com" aria-label="Instagram" className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><RiInstagramLine className="size-4" /></a><a href="https://youtube.com" aria-label="YouTube" className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><span className="text-xs font-bold">YT</span></a></div></div>
        {groups.map((group) => <nav key={group.title} aria-label={group.title}><h2 className="text-sm font-bold">{group.title}</h2><ul className="mt-4 space-y-3">{group.links.map(([label, href]) => <li key={label}><Link href={href} className="text-sm text-white/65 transition-colors hover:text-white">{label}</Link></li>)}</ul></nav>)}
      </div>
      <div className="border-t border-white/10"><div className="mx-auto flex w-full max-w-[1880px] flex-col gap-4 px-4 py-5 text-xs text-white/55 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><p>© 2026 FreshCart. All rights reserved.</p><div className="flex flex-wrap items-center gap-3"><span>We accept:</span><span className="rounded bg-white px-2 py-1 font-bold text-[#183b73]">VISA</span><span className="rounded bg-white px-2 py-1 font-bold text-[#18251e]">Mastercard</span><span className="rounded bg-white px-2 py-1 font-bold text-[#1466b8]">PayPal</span></div></div></div>
    </footer>
  </>;
}
