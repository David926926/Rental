import { compare, hash } from "bcryptjs";
import type { SessionUser, User } from "@/lib/types";

const PASSWORD_MIN_LENGTH = 8;

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export function validatePasswordStrength(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `密码至少需要 ${PASSWORD_MIN_LENGTH} 位`;
  }
  return null;
}

export function getAdminEmailWhitelist() {
  return (process.env.ADMIN_EMAIL_WHITELIST ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmailWhitelisted(email: string) {
  return getAdminEmailWhitelist().includes(email.trim().toLowerCase());
}

export function canAccessAdmin(user: Pick<User, "email" | "role"> | SessionUser | null) {
  if (!user) return false;
  return user.role === "admin" && isAdminEmailWhitelisted(user.email);
}
