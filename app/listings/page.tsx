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
  const minRent = typeof params.minRent === "string" ? params.minRent : undefined;
  const maxRent = typeof params.maxRent === "string" ? params.maxRent : undefined;
  const listingType = typeof params.listingType === "string" ? params.listingType : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;

  const listings = await getPublicListings({
    schoolId,
    minRent: minRent ? Number(minRent) : undefined,
    maxRent: maxRent ? Number(maxRent) : undefined,
    listingType,
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
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">学校周边房源列表</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          按学校、预算和房源类型快速筛选，只展示已经通过审核的公开房源。
        </p>
      </div>

      <FilterBar schoolId={schoolId} minRent={minRent} maxRent={maxRent} listingType={listingType} sort={sort} />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {listings.length > 0 ? (
          listingCards.map(({ listing, school, publisher }) => (
            <ListingCard key={listing.id} listing={listing} school={school} publisher={publisher} />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-slate-600">
            当前筛选条件下没有公开房源，可以切换筛选条件或先发布需求。
          </div>
        )}
      </div>
    </div>
  );
}
