"use server";
import type { RegisterData, RegisterResponse } from "./register.interface";

export async function createAccount(data: RegisterData): Promise<RegisterResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("Sign-up is not configured. Please contact support.");
  }

  let response: Response;
  try {
    response = await fetch(new URL("/api/v1/auth/signup", baseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error("Could not reach the sign-up service. Check your connection and try again.");
  }

  let result: RegisterResponse;
  try {
    result = (await response.json()) as RegisterResponse;
    console.log(result);
    
  } catch {
    throw new Error(`The sign-up service returned an unreadable response (${response.status}).`);
  }

  if (!response.ok || result.statusMsg === "fail") {
    throw new Error(result.message || `Account creation failed (${response.status}).`);
  }

  return result;
}
