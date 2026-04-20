import { NextResponse } from "next/server";
import { z } from "zod";
import { canAccessAdmin } from "@/lib/auth";
import { getUserById, reviewListing } from "@/lib/repository";
import { getSessionUser } from "@/lib/session";

const reviewSchema = z.object({
  status: z.enum(["approved", "flagged", "rejected", "removed"]),
  note: z.string().optional(),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  const currentUser = session ? await getUserById(session.id) : null;
  if (!session || !canAccessAdmin(currentUser)) {
    return NextResponse.json({ error: "只有管理员可以审核房源" }, { status: 403 });
  }

  const { id } = await context.params;
  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "审核参数不正确" }, { status: 400 });
  }

  const review = await reviewListing(session.id, id, parsed.data.status, parsed.data.note);
  if (!review) {
    return NextResponse.json({ error: "未找到待审核房源" }, { status: 404 });
  }

  return NextResponse.json({ message: "审核状态已更新" });
}
