import Image from "next/image";
import { RiShoppingCartLine } from "@remixicon/react";
import freshCartLogo from "../../assets/imgi_1_freshcart-logo.49f1b44d.png";

export function LoadingPage() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,#dcfce7_0%,transparent_45%),radial-gradient(ellipse_at_85%_80%,#bbf7d0_0%,transparent_40%),linear-gradient(165deg,#f7fbf8_0%,#eef8f1_48%,#f4faf6_100%)]"
      />
      <div
        aria-hidden="true"
        className="fc-loading-orb fc-loading-orb-a pointer-events-none absolute -left-16 top-20 size-56 rounded-full bg-[#86efac]/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="fc-loading-orb fc-loading-orb-b pointer-events-none absolute -right-10 bottom-24 size-64 rounded-full bg-[#4ade80]/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="fc-loading-orb fc-loading-orb-c pointer-events-none absolute left-1/2 top-1/3 size-40 -translate-x-1/2 rounded-full bg-[#bbf7d0]/40 blur-2xl"
      />

      <div className="fc-loading-rise relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <Image
          src={freshCartLogo}
          alt="FreshCart"
          width={180}
          height={38}
          priority
          className="h-auto w-40 sm:w-44"
        />

        <div className="relative mt-12 flex size-28 items-center justify-center sm:size-32">
          <span
            aria-hidden="true"
            className="fc-loading-ring absolute inset-0 rounded-full border-[3px] border-[#16a34a]/15 border-t-[#16a34a]"
          />
          <span
            aria-hidden="true"
            className="fc-loading-ring-reverse absolute inset-2 rounded-full border-2 border-transparent border-b-[#4ade80]/80"
          />
          <span className="fc-loading-pulse flex size-16 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-[0_12px_32px_-8px_rgba(22,163,74,0.55)] sm:size-20">
            <RiShoppingCartLine aria-hidden="true" className="size-7 sm:size-8" />
          </span>
        </div>

        <h1 className="mt-10 text-2xl font-bold tracking-tight text-[#172a20] sm:text-3xl">
          Fresh<span className="text-[#16a34a]">Cart</span>
        </h1>
        <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500 sm:text-base">
          Gathering your freshest picks. Almost ready.
        </p>

        <div
          role="progressbar"
          aria-label="Loading"
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-8 h-1.5 w-full max-w-56 overflow-hidden rounded-full bg-[#16a34a]/15"
        >
          <div className="fc-loading-bar h-full w-1/3 rounded-full bg-[#16a34a]" />
        </div>

        <div aria-hidden="true" className="mt-5 flex items-center gap-1.5">
          <span className="fc-loading-dot size-1.5 rounded-full bg-[#16a34a]" />
          <span className="fc-loading-dot fc-loading-dot-delay-1 size-1.5 rounded-full bg-[#16a34a]" />
          <span className="fc-loading-dot fc-loading-dot-delay-2 size-1.5 rounded-full bg-[#16a34a]" />
        </div>
      </div>
    </main>
  );
}
