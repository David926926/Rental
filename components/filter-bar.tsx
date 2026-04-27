import { getSchools } from "@/lib/repository";
import { DatePickerField } from "@/components/date-picker-field";

export async function FilterBar({
  schoolId,
  maxRent,
  listingType,
  housingType,
  moveInDate,
  sort,
}: {
  schoolId?: string;
  maxRent?: string;
  listingType?: string;
  housingType?: string;
  moveInDate?: string;
  sort?: string;
}) {
  const schools = await getSchools();

  return (
    <form className="grid gap-3 rounded-3xl border-2 border-cyan-100 bg-white p-5 shadow-sm shadow-cyan-900/5 md:grid-cols-6">
      <select name="schoolId" defaultValue={schoolId} className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none">
        <option value="">School</option>
        {schools.map((school) => (
          <option key={school.id} value={school.id}>
            {school.name}
          </option>
        ))}
      </select>
      <input
        name="maxRent"
        defaultValue={maxRent}
        placeholder="Max price"
        className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none"
      />
      <select name="housingType" defaultValue={housingType} className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none">
        <option value="">Layout</option>
        <option value="Studio">Studio</option>
        <option value="1B1B">1B1B</option>
        <option value="2B1B">2B1B</option>
        <option value="2B2B">2B2B</option>
        <option value="3B2B">3B2B</option>
        <option value="3B3B">3B3B</option>
        <option value="4B1B">4B1B</option>
        <option value="4B2B">4B2B</option>
        <option value="4B3B">4B3B</option>
        <option value="4B4B">4B4B</option>
      </select>
      <DatePickerField
        name="moveInDate"
        defaultValue={moveInDate}
        ariaLabel="Move-in date"
        placeholder="Move-in date"
        buttonClassName="rounded-2xl border-cyan-200 px-4 py-3 focus:border-cyan-500"
      />
      <select name="listingType" defaultValue={listingType} className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none">
        <option value="">Listing type</option>
        <option value="shared">Private room</option>
        <option value="sublet">Entire place</option>
      </select>
      <select name="sort" defaultValue={sort} className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none">
        <option value="latest">Sort by</option>
        <option value="distance_asc">Nearest first</option>
        <option value="rent_asc">Lowest price first</option>
      </select>
      <button className="rounded-2xl bg-gradient-to-r from-cyan-600 to-violet-600 px-4 py-3 font-medium text-white shadow-sm shadow-violet-900/20 transition hover:from-cyan-700 hover:to-violet-700 md:col-span-6">
        Update filters
      </button>
    </form>
  );
}
