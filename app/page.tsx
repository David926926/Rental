import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, KeyRound } from "lucide-react";
import dormExLogo from "@/logo.jpg";

function DormExMark() {
  return (
    <div className="mx-auto w-full max-w-[300px] md:max-w-[360px]">
      <Image
        src={dormExLogo}
        alt="DormEx logo"
        priority
        className="h-auto w-full"
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden px-6 py-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.12),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(251,191,36,0.16),transparent_28%),linear-gradient(180deg,#fff_0%,#f7f2e9_100%)]" />
      <section className="mx-auto flex max-w-5xl flex-col items-center justify-center rounded-[2.5rem] border border-indigo-100 bg-white/80 px-6 py-8 text-center shadow-2xl shadow-indigo-950/10 backdrop-blur md:px-12 md:py-10">
        <DormExMark />

        <p className="mt-4 max-w-2xl text-lg font-medium tracking-wide text-slate-600">
          Search · Connect · Move In
        </p>

        <div className="mt-6 grid w-full max-w-3xl gap-5 md:grid-cols-2">
          <Link
            href="/listings"
            className="group rounded-[2rem] border-2 border-cyan-300 bg-gradient-to-br from-cyan-50 to-sky-100 p-7 text-left text-slate-900 shadow-lg shadow-cyan-900/10 transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-600 text-white">
              <Home />
            </div>
            <p className="text-3xl font-bold">Browse Listings</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">Explore rentals and sublets near your school.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800">
              Start searching <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/publish"
            className="group rounded-[2rem] border-2 border-violet-300 bg-gradient-to-br from-violet-50 to-fuchsia-100 p-7 text-left text-slate-900 shadow-lg shadow-violet-900/10 transition hover:-translate-y-1 hover:border-violet-400 hover:shadow-xl"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white">
              <KeyRound />
            </div>
            <p className="text-3xl font-bold">Post a Listing</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">Submit a rental or sublet listing to be reviewed before it goes live.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-800">
              Post now <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
