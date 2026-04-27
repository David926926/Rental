import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">This listing may still be pending review, or it may have been removed.</p>
        <Link href="/listings" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-cyan-600 to-violet-600 px-5 py-3 font-medium text-white shadow-sm shadow-violet-900/20 transition hover:from-cyan-700 hover:to-violet-700">
          Back to listings
        </Link>
      </div>
    </div>
  );
}
