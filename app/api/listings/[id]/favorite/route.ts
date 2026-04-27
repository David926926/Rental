import { NextResponse } from "next/server";
import { favoriteListing, getListingById } from "@/lib/repository";
import { getSessionUser } from "@/lib/session";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Please log in before saving a listing" }, { status: 401 });
  }

  const { id } = await context.params;
  const listing = await getListingById(id);
  if (!listing || listing.status !== "approved") {
    return NextResponse.json({ error: "This listing cannot be saved" }, { status: 404 });
  }

  await favoriteListing(session.id, id);
  return NextResponse.json({ message: "Listing saved" });
}
