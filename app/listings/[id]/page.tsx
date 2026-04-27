import Image from "next/image";
import { notFound } from "next/navigation";
import { ListingContactActions } from "@/components/listing-contact-actions";
import { getListingById, getSchools } from "@/lib/repository";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function rentalTypeLabel(type: string) {
  return type === "shared" ? "Private room" : "Entire place";
}

function subleaseLabel(value?: string) {
  if (value === "yes") return "Yes";
  if (value === "undecided") return "Pending confirmation";
  return "Not provided";
}

function priceRange(min?: number, max?: number) {
  if (typeof min === "number" && typeof max === "number") return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  if (typeof min === "number") return `From ${formatCurrency(min)}`;
  if (typeof max === "number") return `Up to ${formatCurrency(max)}`;
  return "Not provided";
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing || listing.status !== "approved") {
    notFound();
  }

  const school = (await getSchools()).find((item) => item.id === listing.schoolId);
  const images = listing.images.length > 0 ? listing.images.slice(0, 9) : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <section className="grid gap-4">
        <div className="relative h-[520px] overflow-hidden rounded-[2rem] bg-slate-100">
          <Image src={images[0]} alt={listing.title} fill priority className="object-cover" />
        </div>
        {images.length > 1 ? (
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.slice(1).map((image, index) => (
              <div key={image} className="relative h-32 overflow-hidden rounded-2xl bg-slate-100">
                <Image src={image} alt={`${listing.title} image ${index + 2}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">{school?.name ?? "No school selected"}</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">{listing.title}</h1>
            <p className="mt-3 text-slate-600">{listing.city} · {listing.area} · {listing.address}</p>
          </div>
          <div className="rounded-3xl bg-emerald-50 px-6 py-4 text-right">
            <p className="text-sm text-emerald-700">Price</p>
            <p className="text-3xl font-bold text-emerald-800">{formatCurrency(listing.rent)}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Area</p>
            <p className="mt-1 font-semibold text-slate-900">{listing.area}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Move-in date</p>
            <p className="mt-1 font-semibold text-slate-900">{formatDate(listing.moveInDate)}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Layout</p>
            <p className="mt-1 font-semibold text-slate-900">{listing.housingType ?? "Not provided"}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Listing type</p>
            <p className="mt-1 font-semibold text-slate-900">{rentalTypeLabel(listing.type)}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Official sublease status</p>
            <p className="mt-1 font-semibold text-slate-900">{subleaseLabel(listing.officialSublease)}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Description</h2>
        <p className="mt-4 leading-8 text-slate-600">{listing.description}</p>
      </section>

      <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Acceptable price range</h2>
        <p className="mt-4 text-xl font-semibold text-slate-900">
          {priceRange(listing.acceptableMinPrice, listing.acceptableMaxPrice)}
        </p>
      </section>

      <section className="mt-6">
        <ListingContactActions contactMethod={listing.contactMethod} />
      </section>
    </div>
  );
}
