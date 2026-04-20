import { NextResponse } from "next/server";
import { z } from "zod";
import { createUserByEmailPassword, getUserByEmail } from "@/lib/repository";
import { hashPassword, validatePasswordStrength } from "@/lib/auth";
import { serializeSession, sessionCookieName, sessionCookieOptions } from "@/lib/session";

const registerSchema = z.object({
  name: z.string().trim().min(2, "请输入至少 2 个字符的昵称"),
  email: z.string().trim().email("请输入有效邮箱"),
  password: z.string(),
  confirmPassword: z.string(),
});

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "注册信息不完整" }, { status: 400 });
  }

  const { name, email, password, confirmPassword } = parsed.data;
  const passwordError = validatePasswordStrength(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "两次输入的密码不一致" }, { status: 400 });
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return NextResponse.json({ error: "该邮箱已经注册过了" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await createUserByEmailPassword({
    name,
    email,
    passwordHash,
  });

  const response = NextResponse.json({ message: "注册成功" }, { status: 201 });
  response.cookies.set(sessionCookieName, serializeSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }), sessionCookieOptions);
  return response;
}
