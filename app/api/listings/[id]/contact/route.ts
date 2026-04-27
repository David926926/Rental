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
    return NextResponse.json({ error: "Please log in before contacting the publisher" }, { status: 401 });
  }

  const { id } = await context.params;
  const listing = await getListingById(id);
  if (!listing || listing.status !== "approved") {
    return NextResponse.json({ error: "This listing cannot be contacted right now" }, { status: 404 });
  }

  const parsed = contactSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid message" }, { status: 400 });
  }

  await createContactRecord(session.id, id, parsed.data.message);
  return NextResponse.json({ message: "Your contact request has been sent. The publisher will reach out using their provided contact details." });
}
