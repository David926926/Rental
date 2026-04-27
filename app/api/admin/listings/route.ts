import { NextResponse } from "next/server";
import { canAccessAdmin } from "@/lib/auth";
import { getListings, getUserById } from "@/lib/repository";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const session = await getSessionUser();
  const currentUser = session ? await getUserById(session.id) : null;
  if (!session || !canAccessAdmin(currentUser)) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  return NextResponse.json({ data: await getListings() });
}
