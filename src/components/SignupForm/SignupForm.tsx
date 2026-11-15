"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RiCheckLine } from "@remixicon/react";
import { createAccount } from "@/src/app/account/register/register.api";
import {
  createZodResolver,
  registerSchema,
  type RegisterFormValues,
} from "@/src/app/account/register/register.zod";

const inputClass =
  "h-12 w-full rounded-lg border border-slate-200 bg-white text-sm font-normal text-slate-800 outline-none transition focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/15 placeholder:text-slate-400";

export function SignupForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: createZodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = handleSubmit(
    async ({ name, email, password, confirmPassword, phone }) => {
      setSubmitError("");
      try {
        await createAccount({
          name,
          email,
          password,
          rePassword: confirmPassword,
          phone,
        });
        router.replace("/account?registered=1");
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Unable to create your account.",
        );
      }
    },
  );
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="signup-name"
        >
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="signup-name"
          autoComplete="name"
          placeholder="Your full name"
          className={`${inputClass} mt-2 px-4`}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "signup-name-error" : "signup-name-help"}
          {...register("name")}
        />
        {errors.name && (
          <p id="signup-name-error" className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
        {!errors.name && (
          <p id="signup-name-help" className="mt-1 text-xs text-slate-500">
            Enter your name, for example: Ahmed Abd Al-Muti.
          </p>
        )}
      </div>
      <div>
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="signup-email"
        >
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`${inputClass} mt-2 px-4`}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "signup-email-error" : "signup-email-help"}
          {...register("email")}
        />
        {errors.email && (
          <p id="signup-email-error" className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
        {!errors.email && (
          <p id="signup-email-help" className="mt-1 text-xs text-slate-500">
            Use a valid email address, for example: name@example.com.
          </p>
        )}
      </div>
      <div>
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="signup-password"
        >
          Password <span aria-hidden="true">*</span>
        </label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          className={`${inputClass} mt-2 px-4`}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "signup-password-error" : "signup-password-help"}
          {...register("password")}
        />
        {errors.password && (
          <p id="signup-password-error" role="alert" className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
        {!errors.password && (
          <p id="signup-password-help" className="mt-1 text-xs text-slate-500">
            Use at least 8 characters, including one number and one symbol.
          </p>
        )}
      </div>
      <div>
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="signup-confirm-password"
        >
          Confirm Password <span aria-hidden="true">*</span>
        </label>
        <input
          id="signup-confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          className={`${inputClass} mt-2 px-4`}
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={errors.confirmPassword ? "signup-confirm-password-error" : "signup-confirm-password-help"}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p id="signup-confirm-password-error" className="mt-1 text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
        {!errors.confirmPassword && (
          <p id="signup-confirm-password-help" className="mt-1 text-xs text-slate-500">
            Enter the same password again.
          </p>
        )}
      </div>
      <div>
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="signup-phone"
        >
          Phone Number <span aria-hidden="true">*</span>
        </label>
        <input
          id="signup-phone"
          type="tel"
          autoComplete="tel"
          placeholder="01010700701"
          className={`${inputClass} mt-2 px-4`}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "signup-phone-error" : "signup-phone-help"}
          {...register("phone")}
        />
        {errors.phone && (
          <p id="signup-phone-error" className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
        )}
        {!errors.phone && (
          <p id="signup-phone-help" className="mt-1 text-xs text-slate-500">
            Egyptian mobile: 11 digits starting 010, 011, 012, or 015.
          </p>
        )}
      </div>
      <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
        <input
          type="checkbox"
          className="mt-1 size-4 shrink-0 accent-[#16a34a]"
          aria-describedby={errors.terms ? "signup-terms-error" : undefined}
          {...register("terms")}
        />
        <span>
          I agree to the{" "}
          <a
            href="/support"
            className="font-medium text-[#16a34a] hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/support"
            className="font-medium text-[#16a34a] hover:underline"
          >
            Privacy Policy
          </a>{" "}
          <span aria-hidden="true">*</span>
        </span>
      </label>
      {errors.terms && (
        <p id="signup-terms-error" className="-mt-4 text-xs text-red-600">{errors.terms.message}</p>
      )}
      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#16a34a] px-4 font-semibold text-white transition hover:bg-[#15803d] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2"
      >
        <RiCheckLine className="size-5" />
        {isSubmitting ? "Creating account…" : "Create My Account"}
      </button>
    </form>
  );
}
