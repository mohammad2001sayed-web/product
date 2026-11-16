import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import type { NextApiRequest } from "next";

export async function getAuthToken(): Promise<string | null> {
  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
  if (cookieStore.getAll().length === 0) return null;

  const jwt = await getToken({
    req: { cookies: cookieStore, headers: requestHeaders } as unknown as NextApiRequest,
  });
  return typeof jwt?.token === "string" ? jwt.token : null;
}
