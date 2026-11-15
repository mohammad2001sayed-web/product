import Link from "next/link";
import Image from "next/image";
import loginHero from "../../assets/login-hero.png";
import signupTestimonialAvatar from "../../assets/signup-testimonial-avatar.png";
import { LoginForm } from "../LoginForm/LoginForm";
import { SignupForm } from "../SignupForm/SignupForm";
import {
  RiFacebookFill,
  RiLockLine,
  RiShieldCheckLine,
  RiStarFill,
  RiTimeLine,
  RiTruckLine,
  RiUserLine,
} from "@remixicon/react";

type AuthPageProps = { mode: "login" | "signup"; registrationSuccess?: boolean };

function BrandWordmark() {
  return (
    <Link
      href="/"
      aria-label="FreshCart home"
      className="text-3xl font-bold tracking-tight text-[#172a20]"
    >
      <span className="text-[#16a34a]">Fresh</span>Cart
    </Link>
  );
}

function SocialButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "grid grid-cols-2 gap-2" : "space-y-3"}>
      <button
        type="button"
        className="flex min-h-12 items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]"
      >
        <span aria-hidden="true" className="text-lg font-bold text-[#4285f4]">
          G
        </span>
        {compact ? "Google" : "Continue with Google"}
      </button>
      <button
        type="button"
        className="flex min-h-12 items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]"
      >
        <RiFacebookFill aria-hidden="true" className="size-5 text-[#1877f2]" />
        {compact ? "Facebook" : "Continue with Facebook"}
      </button>
    </div>
  );
}

function Divider({ label = "or continue with email" }: { label?: string }) {
  return (
    <div className="my-6 flex items-center gap-4 text-xs font-medium uppercase tracking-wide text-slate-400">
      <span className="h-px flex-1 bg-slate-200" />
      {label}
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function CartIllustration() {
  return (
    <div className="relative mx-auto aspect-[1.53] w-full max-w-225 overflow-hidden rounded-2xl shadow-lg">
      <Image
        src={loginHero}
        alt="A shopping cart filled with fresh produce"
        fill
        priority
        sizes="(max-width: 1023px) 90vw, 47vw"
        className="object-cover"
      />
    </div>
  );
}

function LoginContent({ registrationSuccess = false }: { registrationSuccess?: boolean }) {
  return (
    <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-12">
      <section className="text-center lg:py-8">
        <CartIllustration />
        <h1 className="mt-6 text-2xl font-bold leading-tight text-[#172a20] sm:text-3xl">
          FreshCart - Your One-Stop Shop for Fresh Products
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          Join thousands of happy customers who trust FreshCart for their daily
          grocery needs
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <RiTruckLine className="size-4 text-[#16a34a]" />
            Free Delivery
          </span>
          <span className="inline-flex items-center gap-2">
            <RiShieldCheckLine className="size-4 text-[#16a34a]" />
            Secure Payment
          </span>
          <span className="inline-flex items-center gap-2">
            <RiTimeLine className="size-4 text-[#16a34a]" />
            24/7 Support
          </span>
        </div>
      </section>
      <section
        aria-labelledby="login-heading"
        className="mx-auto w-full max-w-225 rounded-2xl border border-slate-100 bg-white px-6 py-8 shadow-xl shadow-slate-900/10 sm:px-10 sm:py-10 lg:px-12"
      >
        <div className="text-center">
          <BrandWordmark />
          <h2
            id="login-heading"
            className="mt-5 text-2xl font-bold text-slate-900"
          >
            Welcome Back!
          </h2>
          <p className="mt-2 text-slate-600">
            Sign in to continue your fresh shopping experience
          </p>
          {registrationSuccess && (
            <p
              role="status"
              className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
            >
              Your account was created successfully. Sign in to continue.
            </p>
          )}
        </div>
        <div className="mt-7">
          <SocialButtons />
        </div>
        <Divider />
        <div className="mt-7">
          <LoginForm />
        </div>
        <div className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
          New to FreshCart?{" "}
          <Link
            href="/account/register"
            className="font-bold text-[#16a34a] hover:underline"
          >
            Create an account
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <RiLockLine className="size-3.5" />
            SSL Secured
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RiUserLine className="size-3.5" />
            50K+ Users
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RiStarFill className="size-3.5 text-amber-400" />
            4.9 Rating
          </span>
        </div>
      </section>
    </div>
  );
}

function SignupContent() {
  return (
    <div className="grid w-full items-start gap-10 lg:grid-cols-[1fr_1.04fr] lg:gap-12">
      <section className="pt-2 lg:pt-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-700 sm:text-4xl">
          Welcome to <span className="text-[#16a34a]">FreshCart</span>
        </h1>
        <p className="mt-3 max-w-xl text-lg leading-7 text-slate-600">
          Join thousands of happy customers who enjoy fresh groceries delivered
          right to their doorstep.
        </p>
        <div className="mt-8 space-y-6">
          {[
            {
              title: "Premium Quality",
              description:
                "Premium quality products sourced from trusted suppliers.",
              Icon: RiStarFill,
            },
            {
              title: "Fast Delivery",
              description: "Same-day delivery available in most areas",
              Icon: RiTruckLine,
            },
            {
              title: "Secure Shopping",
              description: "Your data and payments are completely secure",
              Icon: RiShieldCheckLine,
            },
          ].map(({ title, description, Icon }) => (
            <div key={title} className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#c9f7d7] text-[#16a34a]">
                <Icon className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-800">{title}</h2>
                <p className="mt-0.5 text-sm leading-5 text-slate-600">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <blockquote className="mt-8 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Image
              src={signupTestimonialAvatar}
              alt=""
              width={44}
              height={44}
              className="size-11 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Sarah Johnson
              </p>
              <div
                aria-label="5 out of 5 stars"
                className="mt-0.5 flex text-amber-400"
              >
                <RiStarFill />
                <RiStarFill />
                <RiStarFill />
                <RiStarFill />
                <RiStarFill />
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm italic leading-6 text-slate-600">
            “FreshCart has transformed my shopping experience. The quality of
            the products is outstanding, and the delivery is always on time.
            Highly recommend!”
          </p>
        </blockquote>
      </section>
      <section
        aria-labelledby="signup-heading"
        className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-8 shadow-xl shadow-slate-900/10 sm:px-9 sm:py-10"
      >
        <div className="text-center">
          <h2 id="signup-heading" className="text-3xl font-bold text-slate-700">
            Create Your Account
          </h2>
          <p className="mt-2 text-slate-600">
            Start your fresh journey with us today
          </p>
        </div>
        <div className="mt-8">
          <SocialButtons compact />
        </div>
        <Divider label="or" />
        <div className="mt-8">
          <SignupForm />
        </div>
        <div className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/account"
            className="font-semibold text-[#16a34a] hover:underline"
          >
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
}

export function AuthPage({ mode, registrationSuccess = false }: AuthPageProps) {
  return (
    <main className="flex-1 bg-white px-4 py-9 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto flex w-full max-w-[1880px] items-center">
        {mode === "login" ? <LoginContent registrationSuccess={registrationSuccess} /> : <SignupContent />}
      </div>
    </main>
  );
}
