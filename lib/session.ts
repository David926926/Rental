import { cookies } from "next/headers";
import type { SessionUser, UserRole } from "@/lib/types";

const SESSION_COOKIE = "rent_platform_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SessionUser;
    return parsed;
  } catch {
    return null;
  }
}

export function serializeSession(input: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}) {
  return JSON.stringify(input);
}

export const sessionCookieName = SESSION_COOKIE;
export const sessionCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: SESSION_MAX_AGE,
};
