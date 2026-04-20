import { NextResponse } from "next/server";
import { z } from "zod";
import { createContactRecord, getListingById } from "@/lib/repository";
import { getSessionUser } from "@/lib/session";

const contactSchema = z.object({
  message: z.string().min(2),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "请先登录后再联系发布者" }, { status: 401 });
  }

  const { id } = await context.params;
  const listing = await getListingById(id);
  if (!listing || listing.status !== "approved") {
    return NextResponse.json({ error: "该房源暂时无法联系" }, { status: 404 });
  }

  const parsed = contactSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "请输入有效的留言内容" }, { status: 400 });
  }

  await createContactRecord(session.id, id, parsed.data.message);
  return NextResponse.json({ message: "联系请求已提交，发布者将通过预留方式联系你。" });
}
