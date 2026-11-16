import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

type SignInResponse = {
  message?: string;
  statusMsg?: "success" | "fail";
  token?: string;
  user?: { id?: string; _id?: string; name?: string; email?: string; role?: string };
};

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
        if (!baseUrl) throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");

        const response = await fetch(new URL("/api/v1/auth/signin", baseUrl), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: credentials?.email, password: credentials?.password }),
          cache: "no-store",
        });
        let result: SignInResponse;
        try {
          result = (await response.json()) as SignInResponse;
        } catch {
          if (response.status === 401) return null;
          throw new Error("The sign-in service returned an unreadable response.");
        }

        if (response.status === 401 || result.statusMsg === "fail") return null;
        if (!response.ok) throw new Error(result.message || "Unable to sign in.");
        if (!result.token || !result.user) {
          throw new Error(result.message || "The sign-in response was incomplete.");
        }

        const email = result.user.email || credentials?.email || "";
        return {
          id: result.user.id || result.user._id || email,
          name: result.user.name || email,
          email,
          role: result.user.role || "",
          token: result.token,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.role = token.role || "";
      return session;
    },
  },
  pages: { signIn: "/account" },
};
