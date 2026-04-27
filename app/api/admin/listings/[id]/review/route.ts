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
    return NextResponse.json({ error: "Only admins can review listings" }, { status: 403 });
  }

  const { id } = await context.params;
  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "The review parameters are invalid" }, { status: 400 });
  }

  const review = await reviewListing(session.id, id, parsed.data.status, parsed.data.note);
  if (!review) {
    return NextResponse.json({ error: "Pending listing not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Review status updated" });
}
