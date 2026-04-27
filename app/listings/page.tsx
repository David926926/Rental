import { FilterBar } from "@/components/filter-bar";
import { ListingCard } from "@/components/listing-card";
import { getPublicListings, getSchools, getUserById } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const schoolId = typeof params.schoolId === "string" ? params.schoolId : undefined;
  const maxRent = typeof params.maxRent === "string" ? params.maxRent : undefined;
  const listingType = typeof params.listingType === "string" ? params.listingType : undefined;
  const housingType = typeof params.housingType === "string" ? params.housingType : undefined;
  const moveInDate = typeof params.moveInDate === "string" ? params.moveInDate : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;

  const listings = await getPublicListings({
    schoolId,
    maxRent: maxRent ? Number(maxRent) : undefined,
    listingType,
    housingType,
    moveInDate,
    sort,
  });
  const schools = await getSchools();
  const listingCards = await Promise.all(
    listings.map(async (listing) => ({
      listing,
      school: schools.find((item) => item.id === listing.schoolId),
      publisher: await getUserById(listing.publisherId),
    })),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Housing Search</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Browse Listings</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Quickly filter approved listings by school, price, layout, listing type, and move-in date.
        </p>
      </div>

      <FilterBar
        schoolId={schoolId}
        maxRent={maxRent}
        listingType={listingType}
        housingType={housingType}
        moveInDate={moveInDate}
        sort={sort}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {listings.length > 0 ? (
          listingCards.map(({ listing, school, publisher }) => (
            <ListingCard key={listing.id} listing={listing} school={school} publisher={publisher} />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-slate-600">
            No public listings match your current filters. Try adjusting them or post your own listing first.
          </div>
        )}
      </div>
    </div>
  );
}
