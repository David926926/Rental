import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const mode = params.mode === "admin" ? "admin" : "user";

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Account Access</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">Choose your login role</h1>
          <p className="mt-3 text-slate-600">
            After logging in, you can post listings, save favorites, contact publishers, or access the appropriate admin pages.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/login"
            className={`block rounded-[2rem] border-2 p-5 shadow-sm transition ${mode === "user" ? "border-cyan-400 bg-cyan-50 text-slate-900 shadow-cyan-900/10" : "border-slate-200 bg-white hover:border-cyan-200"}`}
          >
            <p className="text-xl font-semibold">User</p>
            <p className={`mt-2 text-sm leading-6 ${mode === "user" ? "text-slate-700" : "text-slate-600"}`}>
              Browse listings, post sublets, and save homes you are interested in.
            </p>
          </a>

          <a
            href="/login?mode=admin"
            className={`block rounded-[2rem] border-2 p-5 shadow-sm transition ${mode === "admin" ? "border-emerald-400 bg-emerald-50 text-slate-900 shadow-emerald-900/10" : "border-slate-200 bg-white hover:border-emerald-200"}`}
          >
            <p className="text-xl font-semibold">Admin</p>
            <p className={`mt-2 text-sm leading-6 ${mode === "admin" ? "text-slate-700" : "text-slate-600"}`}>
              Review listing content and maintain platform quality.
            </p>
          </a>
        </div>
      </div>

      <div>
        <LoginForm mode={mode} />
      </div>
    </div>
  );
}
