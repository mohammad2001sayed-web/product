import type { FieldError, FieldErrors, FieldValues, Resolver } from "react-hook-form";
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Enter at least 2 characters for your name.")
      .regex(
        /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u,
        "Use letters, spaces, apostrophes, or hyphens only.",
      ),
    email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address, for example: name@example.com."),
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .regex(/(?=.*\d)(?=.*[^A-Za-z0-9])/, "Include at least one number and one symbol."),
    confirmPassword: z.string().min(1, "Confirm your password."),
    phone: z
      .string()
      .min(1, "Enter your phone number.")
      .regex(
        /^(?:01[0125]\d{8}|\+201[0125]\d{8}|00201[0125]\d{8})$/,
        "Enter an Egyptian mobile number, e.g. 01010700701 or +201010700701.",
      ),
    terms: z.boolean().refine((accepted) => accepted, "Please accept the terms to continue."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match. Re-enter the same password.",
  });

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address, for example: name@example.com."),
  password: z.string().min(1, "Enter your password."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;

export function createZodResolver<T extends FieldValues>(
  schema: z.ZodType<T>,
): Resolver<T> {
  return async (values) => {
    const result = schema.safeParse(values);
    if (result.success) return { values: result.data, errors: {} };

    const fieldErrors: Record<string, FieldError> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join(".");
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = { type: "validation", message: issue.message };
      }
    }

    return {
      values: {},
      errors: fieldErrors as FieldErrors<T>,
    };
  };
}
