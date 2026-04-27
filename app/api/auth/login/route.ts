import { NextResponse } from "next/server";
import { getUserWithPasswordByEmail } from "@/lib/repository";
import { verifyPassword } from "@/lib/auth";
import { serializeSession, sessionCookieName, sessionCookieOptions } from "@/lib/session";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Please enter both email and password" }, { status: 400 });
  }

  const user = await getUserWithPasswordByEmail(email);
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const response = NextResponse.json({ message: "Login successful" });
  response.cookies.set(sessionCookieName, serializeSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }), sessionCookieOptions);
  return response;
}
