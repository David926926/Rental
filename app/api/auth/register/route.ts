import { NextResponse } from "next/server";
import { z } from "zod";
import { createUserByEmailPassword, getUserByEmail } from "@/lib/repository";
import { hashPassword, validatePasswordStrength } from "@/lib/auth";
import { serializeSession, sessionCookieName, sessionCookieOptions } from "@/lib/session";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter a name with at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string(),
  confirmPassword: z.string(),
});

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Registration information is incomplete" }, { status: 400 });
  }

  const { name, email, password, confirmPassword } = parsed.data;
  const passwordError = validatePasswordStrength(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "The two passwords do not match" }, { status: 400 });
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return NextResponse.json({ error: "This email address is already registered" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await createUserByEmailPassword({
    name,
    email,
    passwordHash,
  });

  const response = NextResponse.json({ message: "Registration successful" }, { status: 201 });
  response.cookies.set(sessionCookieName, serializeSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }), sessionCookieOptions);
  return response;
}
