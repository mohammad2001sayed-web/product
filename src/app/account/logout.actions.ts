"use client";

import { signOut } from "next-auth/react";

export async function logout() {
  return signOut({ redirect: false });
}
