import Link from "next/link";
import { AdminReviewForm } from "@/components/admin-review-form";
import { getListings, getReports, getSchools, getUserById } from "@/lib/repository";
import { canAccessAdmin } from "@/lib/auth";
import { getSessionUser } from "@/lib/session";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const session = await getSessionUser();
  const currentUser = session ? await getUserById(session.id) : null;

  if (!session || !canAccessAdmin(currentUser)) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">后台仅管理员可访问</h1>
          <p className="mt-3 leading-7 text-slate-600">请使用已授权的管理员账号登录查看审核流。</p>
          <Link href="/login" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-cyan-600 to-violet-600 px-5 py-3 font-medium text-white shadow-sm shadow-violet-900/20 transition hover:from-cyan-700 hover:to-violet-700">
            去登录管理员账号
          </Link>
        </div>
      </div>
    );
  }

  const listings = await getListings();
  const schools = await getSchools();
  const reports = await getReports();
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
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Admin</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">房源审核后台</h1>
        <p className="mt-3 text-slate-600">查看待审核房源、变更状态、处理举报。</p>
      </div>

      <section className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">举报列表</h2>
        <div className="mt-4 space-y-3">
          {reports.length > 0 ? (
            reports.map((report) => {
              const listing = listings.find((item) => item.id === report.listingId);
              return (
                <div key={report.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">{listing?.title ?? "未知房源"}</p>
                  <p className="mt-2">{report.reason}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(report.createdAt)}</p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">当前没有举报记录。</p>
          )}
        </div>
      </section>

      <div className="grid gap-6">
        {listingCards.map(({ listing, school, publisher }) => {
          return (
            <article key={listing.id} className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_320px]">
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{listing.title}</h2>
                    <p className="mt-2 text-slate-600">
                      {listing.city} · {listing.area} · {school?.name ?? "未绑定学校"}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">状态</p>
                    <p className="mt-1 font-semibold text-slate-900">{listing.status}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">租金</p>
                    <p className="mt-1 font-medium text-slate-900">{formatCurrency(listing.rent)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">入住</p>
                    <p className="mt-1 font-medium text-slate-900">{formatDate(listing.moveInDate)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">发布者</p>
                    <p className="mt-1 font-medium text-slate-900">{publisher?.name ?? "未知"}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">联系方式</p>
                    <p className="mt-1 font-medium text-slate-900">{listing.contactMethod}</p>
                  </div>
                </div>
                <p className="mt-5 leading-7 text-slate-600">{listing.description}</p>
              </div>
              <AdminReviewForm listingId={listing.id} />
            </article>
          );
        })}
      </div>
    </div>
  );
}
