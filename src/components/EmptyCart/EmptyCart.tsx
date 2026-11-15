import Image from "next/image";
import Link from "next/link";

export function EmptyCart({ signedOut = false }: { signedOut?: boolean }) {
  return (
    <section className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 py-12 text-center shadow-sm">
      <div className="relative mb-2 size-44 sm:size-52">
        <Image src="/empty-cart.svg" alt="An empty shopping cart" fill sizes="208px" className="object-contain" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
        {signedOut ? "Sign in to see your cart" : "Your cart is waiting"}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
        {signedOut
          ? "Sign in to see your saved cart and continue shopping."
          : "Your cart is empty. Explore the store and add something you love."}
      </p>
      <Link href={signedOut ? "/account" : "/shop"} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#16a34a] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#128c3f]">
        {signedOut ? "Sign In" : "Start Shopping"}
      </Link>
    </section>
  );
}
