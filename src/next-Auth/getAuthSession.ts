import { getServerSession } from "next-auth";
import { connection } from "next/server";
import { authOptions } from "./authOption";

export async function getAuthSession() {
  await connection();
  return getServerSession(authOptions);
}
