import { getSchools } from "@/lib/repository";

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
        <option value="">学校</option>
        {schools.map((school) => (
          <option key={school.id} value={school.id}>
            {school.name}
          </option>
        ))}
      </select>
      <input
        name="maxRent"
        defaultValue={maxRent}
        placeholder="最高价格"
        className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none"
      />
      <select name="housingType" defaultValue={housingType} className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none">
        <option value="">房型</option>
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
      <input
        name="moveInDate"
        type="date"
        defaultValue={moveInDate}
        aria-label="可入住时间"
        className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none"
      />
      <select name="listingType" defaultValue={listingType} className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none">
        <option value="">出租类型</option>
        <option value="shared">单间</option>
        <option value="sublet">整套</option>
      </select>
      <select name="sort" defaultValue={sort} className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none">
        <option value="latest">排序方式</option>
        <option value="distance_asc">距离优先</option>
        <option value="rent_asc">低价优先</option>
      </select>
      <button className="rounded-2xl bg-gradient-to-r from-cyan-600 to-violet-600 px-4 py-3 font-medium text-white shadow-sm shadow-violet-900/20 transition hover:from-cyan-700 hover:to-violet-700 md:col-span-6">
        更新筛选
      </button>
    </form>
  );
}
