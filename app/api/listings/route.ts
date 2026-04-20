import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { createListing, getPublicListings, getSchools } from "@/lib/repository";
import { getSessionUser } from "@/lib/session";
import type { ListingType } from "@/lib/types";

type ListingPayload = Record<string, unknown>;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberOrDefault(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function optionalNumber(value: unknown) {
  if (text(value) === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function dateOrToday(value: unknown) {
  return text(value) || new Date().toISOString().slice(0, 10);
}

function listingTypeOrDefault(value: unknown): ListingType {
  const type = text(value);
  return type === "entire" || type === "shared" || type === "sublet" ? type : "sublet";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const listings = await getPublicListings({
    schoolId: url.searchParams.get("schoolId") ?? undefined,
    city: url.searchParams.get("city") ?? undefined,
    area: url.searchParams.get("area") ?? undefined,
    minRent: url.searchParams.get("minRent") ? Number(url.searchParams.get("minRent")) : undefined,
    maxRent: url.searchParams.get("maxRent") ? Number(url.searchParams.get("maxRent")) : undefined,
    moveInDate: url.searchParams.get("moveInDate") ?? undefined,
    listingType: url.searchParams.get("listingType") ?? undefined,
    sort: url.searchParams.get("sort") ?? undefined,
  });
  return NextResponse.json({ data: listings });
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "请先登录后再发布" }, { status: 401 });
  }

  const payload = (await request.json()) as ListingPayload;
  const schools = await getSchools();
  const schoolId = text(payload.schoolId) || schools[0]?.id || "nyu";
  const contactEmail = text(payload.contactEmail) || "未填写";
  const contactWechat = text(payload.contactWechat) || "未填写";

  try {
    await createListing({
      title: text(payload.title) || "未命名房源",
      description: text(payload.description) || "发布者暂未填写详细描述。",
      city: text(payload.city) || "未填写",
      area: text(payload.area) || "未填写",
      address: text(payload.address) || "未填写",
      schoolId,
      rent: numberOrDefault(payload.rent, 0),
      distanceToSchool: optionalNumber(payload.distanceToSchool),
      deposit: 0,
      moveInDate: dateOrToday(payload.moveInDate),
      availableUntil: text(payload.availableUntil) || undefined,
      leaseMonths: 1,
      bedrooms: 1,
      bathrooms: 1,
      furnishing: true,
      allowsPets: false,
      type: listingTypeOrDefault(payload.type),
      contactMethod: `邮箱 ${contactEmail} / 微信 ${contactWechat}`,
      publisherId: session.id,
      images: [
        text(payload.imageUrl) ||
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      ],
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return NextResponse.json({ error: "所选学校不存在，请先初始化学校数据后再发布。" }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ error: "服务器保存房源时出错，请稍后重试。" }, { status: 500 });
  }

  return NextResponse.json({ message: "提交成功，房源已进入待审核状态。" }, { status: 201 });
}
