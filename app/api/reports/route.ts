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
    return NextResponse.json({ error: "Please log in before submitting a report" }, { status: 401 });
  }

  const parsed = reportSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "The report information is incomplete" }, { status: 400 });
  }

  const listing = await getListingById(parsed.data.listingId);
  if (!listing) {
    return NextResponse.json({ error: "The listing could not be found" }, { status: 404 });
  }

  await createReport(session.id, parsed.data.listingId, parsed.data.reason);
  return NextResponse.json({ message: "Your report has been submitted. An admin will review it soon." }, { status: 201 });
}
