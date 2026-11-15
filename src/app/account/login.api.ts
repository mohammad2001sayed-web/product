"use server";

import { cookies } from "next/headers";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  statusMsg?: "success" | "fail";
  token?: string;
  user?: { name: string; email: string; role: string };
}

export async function signIn(data: LoginData): Promise<LoginResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");

  const response = await fetch(new URL("/api/v1/auth/signin", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result: LoginResponse = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to sign in.");
  if (result.user?.name) {
    (await cookies()).set("user_name", result.user.name, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
    });
  }
  if (result.token) {
    (await cookies()).set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  const safeResult = { ...result };
  delete safeResult.token;
  return safeResult;
}




