import { NextResponse } from "next/server";
import { z } from "zod";
import { getListingById, updateListing } from "@/lib/repository";
import { getSessionUser } from "@/lib/session";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const listing = await getListingById(id);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
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
    return NextResponse.json({ error: "Please log in before editing a listing" }, { status: 401 });
  }

  const { id } = await context.params;
  const listing = await getListingById(id);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  if (listing.publisherId !== session.id && session.role !== "admin") {
    return NextResponse.json({ error: "You do not have permission to edit this listing" }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "The update fields are invalid" }, { status: 400 });
  }

  const updated = await updateListing(id, parsed.data);
  return NextResponse.json({ message: "Listing updated successfully", data: updated });
}
