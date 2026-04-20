import Image from "next/image";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { FavoriteButton } from "@/components/favorite-button";
import { ReportForm } from "@/components/report-form";
import { getListingById, getSchools, getUserById } from "@/lib/repository";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing || listing.status !== "approved") {
    notFound();
  }

  const school = (await getSchools()).find((item) => item.id === listing.schoolId);
  const publisher = await getUserById(listing.publisherId);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="relative h-[420px] overflow-hidden rounded-[2rem]">
            <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">{school?.name ?? "未绑定学校"}</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">{listing.title}</h1>
                <p className="mt-2 text-slate-600">{listing.city} · {listing.area} · {listing.address}</p>
              </div>
              <div className="rounded-3xl bg-emerald-50 px-5 py-4 text-right">
                <p className="text-sm text-emerald-700">月租金</p>
                <p className="text-3xl font-bold text-emerald-800">{formatCurrency(listing.rent)}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">入住时间</p>
                <p className="mt-1 font-medium text-slate-900">{formatDate(listing.moveInDate)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">租期</p>
                <p className="mt-1 font-medium text-slate-900">{listing.leaseMonths} 个月</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">押金</p>
                <p className="mt-1 font-medium text-slate-900">{formatCurrency(listing.deposit)}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <h2 className="text-xl font-semibold text-slate-900">房源描述</h2>
              <p className="leading-8 text-slate-600">{listing.description}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">发布者信息</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p><span className="font-medium text-slate-900">姓名：</span>{publisher?.name}</p>
              <p><span className="font-medium text-slate-900">邮箱：</span>{publisher?.email}</p>
              <p><span className="font-medium text-slate-900">联系方式：</span>{listing.contactMethod}</p>
              <p><span className="font-medium text-slate-900">认证状态：</span>{publisher?.verificationStatus ?? "unverified"}</p>
            </div>
          </div>
          <FavoriteButton listingId={listing.id} />
          <ContactForm listingId={listing.id} />
          <ReportForm listingId={listing.id} />
        </aside>
      </div>
    </div>
  );
}
