import { getSchools } from "@/lib/repository";

export async function FilterBar({
  schoolId,
  minRent,
  maxRent,
  listingType,
  sort,
}: {
  schoolId?: string;
  minRent?: string;
  maxRent?: string;
  listingType?: string;
  sort?: string;
}) {
  const schools = await getSchools();

  return (
    <form className="grid gap-3 rounded-3xl border-2 border-cyan-100 bg-white p-5 shadow-sm shadow-cyan-900/5 md:grid-cols-5">
      <select name="schoolId" defaultValue={schoolId} className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none">
        <option value="">全部学校</option>
        {schools.map((school) => (
          <option key={school.id} value={school.id}>
            {school.name}
          </option>
        ))}
      </select>
      <input
        name="minRent"
        defaultValue={minRent}
        placeholder="最低租金"
        className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none"
      />
      <input
        name="maxRent"
        defaultValue={maxRent}
        placeholder="最高租金"
        className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none"
      />
      <select name="listingType" defaultValue={listingType} className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none">
        <option value="">出租类型</option>
        <option value="sublet">整套转租</option>
        <option value="shared">单间转租</option>
        <option value="entire">整租</option>
      </select>
      <select name="sort" defaultValue={sort} className="rounded-2xl border border-cyan-200 px-4 py-3 focus:border-cyan-500 focus:outline-none">
        <option value="latest">筛选标准</option>
        <option value="distance_asc">距离优先</option>
        <option value="rent_asc">低价优先</option>
      </select>
      <button className="rounded-2xl bg-gradient-to-r from-cyan-600 to-violet-600 px-4 py-3 font-medium text-white shadow-sm shadow-violet-900/20 transition hover:from-cyan-700 hover:to-violet-700 md:col-span-5">
        更新筛选
      </button>
    </form>
  );
}
