"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RiLockLine, RiMailLine } from "@remixicon/react";
import { signIn } from "@/src/app/account/login.api";
import {
  createZodResolver,
  loginSchema,
  type LoginFormValues,
} from "@/src/app/account/register/register.zod";

const inputClass = "h-12 w-full rounded-lg border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/15 placeholder:text-slate-400";

export function LoginForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: createZodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const onSubmit = handleSubmit(async (values) => {
    setSubmitError("");
    try {
      await signIn(values);
      router.push("/");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to sign in.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">Email Address</label>
        <span className="relative mt-2 block"><input id="login-email" type="email" autoComplete="email" placeholder="Enter your email" className={`${inputClass} pl-10 pr-4`} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "login-email-error" : undefined} {...register("email")} /><RiMailLine aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /></span>
        {errors.email && <p id="login-email-error" className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">Password</label>
        <span className="relative mt-2 block"><input id="login-password" type="password" autoComplete="current-password" placeholder="Enter your password" className={`${inputClass} pl-4 pr-11`} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "login-password-error" : undefined} {...register("password")} /><RiLockLine aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /></span>
        {errors.password && <p id="login-password-error" className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>
      <label className="flex items-center gap-3 text-sm text-slate-600"><input type="checkbox" className="size-4 accent-[#16a34a]" />Keep me signed in</label>
      {submitError && <p role="alert" className="text-sm text-red-600">{submitError}</p>}
      <button disabled={isSubmitting} type="submit" className="min-h-12 w-full rounded-lg bg-[#16a34a] px-4 text-base font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#15803d] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2">{isSubmitting ? "Signing inâ€¦" : "Sign In"}</button>
    </form>
  );
}



