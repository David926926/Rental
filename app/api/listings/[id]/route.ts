import { NextResponse } from "next/server";
import { z } from "zod";
import { getListingById, updateListing } from "@/lib/repository";
import { getSessionUser } from "@/lib/session";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const listing = await getListingById(id);
  if (!listing) {
    return NextResponse.json({ error: "未找到房源" }, { status: 404 });
  }
  return NextResponse.json({ data: listing });
}

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  contactMethod: z.string().min(2).optional(),
  rent: z.coerce.number().positive().optional(),
  status: z.enum(["pending", "approved", "flagged", "rejected", "removed"]).optional(),
});

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "请先登录后再编辑房源" }, { status: 401 });
  }

  const { id } = await context.params;
  const listing = await getListingById(id);
  if (!listing) {
    return NextResponse.json({ error: "未找到房源" }, { status: 404 });
  }
  if (listing.publisherId !== session.id && session.role !== "admin") {
    return NextResponse.json({ error: "你没有权限修改这个房源" }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "更新字段格式不正确" }, { status: 400 });
  }

  const updated = await updateListing(id, parsed.data);
  return NextResponse.json({ message: "房源信息已更新", data: updated });
}
