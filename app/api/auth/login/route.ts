import { NextResponse } from "next/server";
import { getUserWithPasswordByEmail } from "@/lib/repository";
import { verifyPassword } from "@/lib/auth";
import { serializeSession, sessionCookieName, sessionCookieOptions } from "@/lib/session";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "请输入邮箱和密码" }, { status: 400 });
  }

  const user = await getUserWithPasswordByEmail(email);
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
  }

  const response = NextResponse.json({ message: "登录成功" });
  response.cookies.set(sessionCookieName, serializeSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }), sessionCookieOptions);
  return response;
}
