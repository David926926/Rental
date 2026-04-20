import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Sofa, PawPrint } from "lucide-react";
import type { Listing, School, User } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ListingCard({
  listing,
  school,
  publisher,
}: {
  listing: Listing;
  school?: School;
  publisher?: User | null;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56">
        <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700">
          {listing.type === "sublet" ? "整套转租" : listing.type === "shared" ? "单间转租" : "整租"}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">{listing.title}</h3>
            <span className="text-lg font-bold text-emerald-700">{formatCurrency(listing.rent)}</span>
          </div>
          <p className="text-sm text-slate-600">
            {listing.city} · {listing.area} · {school?.name ?? "未绑定学校"}
            {typeof listing.distanceToSchool === "number" ? ` · ${listing.distanceToSchool} km` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1"><BedDouble size={14} />{listing.bedrooms} 室</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1"><Bath size={14} />{listing.bathrooms} 卫</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1"><Sofa size={14} />{listing.furnishing ? "带家具" : "无家具"}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1"><PawPrint size={14} />{listing.allowsPets ? "可宠物" : "不接受宠物"}</span>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{listing.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">发布者：{publisher?.name ?? "匿名"}</span>
          <Link href={`/listings/${listing.id}`} className="font-medium text-slate-900 hover:text-emerald-700">
            查看详情
          </Link>
        </div>
      </div>
    </article>
  );
}
