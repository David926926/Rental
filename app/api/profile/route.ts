import { NextResponse } from "next/server";
import { z } from "zod";
import { updateUserProfile } from "@/lib/repository";
import { getSessionUser } from "@/lib/session";

const profileSchema = z.object({
  schoolId: z.string().trim().optional(),
  phone: z.string().trim().max(50, "Phone number is too long").optional(),
  wechat: z.string().trim().max(50, "WeChat ID is too long").optional(),
});

export async function PATCH(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Please log in before updating your profile" }, { status: 401 });
  }

  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "The profile fields are invalid" }, { status: 400 });
  }

  const user = await updateUserProfile(session.id, parsed.data);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Profile updated successfully",
    data: user,
  });
}
