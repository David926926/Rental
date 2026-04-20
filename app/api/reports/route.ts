import { NextResponse } from "next/server";
import { z } from "zod";
import { createReport, getListingById } from "@/lib/repository";
import { getSessionUser } from "@/lib/session";

const reportSchema = z.object({
  listingId: z.string().min(2),
  reason: z.string().min(4),
});

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "请先登录后再举报" }, { status: 401 });
  }

  const parsed = reportSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "举报内容不完整" }, { status: 400 });
  }

  const listing = await getListingById(parsed.data.listingId);
  if (!listing) {
    return NextResponse.json({ error: "未找到对应房源" }, { status: 404 });
  }

  await createReport(session.id, parsed.data.listingId, parsed.data.reason);
  return NextResponse.json({ message: "举报已提交，管理员会尽快处理。" }, { status: 201 });
}
