import Link from "next/link";
import { PublishForm } from "@/components/publish-form";
import { getSchools } from "@/lib/repository";
import { getSessionUser } from "@/lib/session";

export default async function PublishPage() {
  const session = await getSessionUser();

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">发布前需要先登录</h1>
          <p className="mt-3 leading-7 text-slate-600">未登录用户可以浏览房源，但不能发布新内容。</p>
          <Link href="/login" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-cyan-600 to-violet-600 px-5 py-3 font-medium text-white shadow-sm shadow-violet-900/20 transition hover:from-cyan-700 hover:to-violet-700">
            前往登录
          </Link>
        </div>
      </div>
    );
  }

  const schools = await getSchools();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Post</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">发布房源</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          提交房源信息后会进入审核，通过后展示在房源列表中。
        </p>
      </div>
      <PublishForm schools={schools} />
    </div>
  );
}
