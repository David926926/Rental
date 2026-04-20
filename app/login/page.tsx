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
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">选择你的登录身份</h1>
          <p className="mt-3 text-slate-600">
            登录后可以发布房源、收藏房源、联系发布者或进入对应的管理页面。
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/login"
            className={`block rounded-[2rem] border-2 p-5 shadow-sm transition ${mode === "user" ? "border-cyan-400 bg-cyan-50 text-slate-900 shadow-cyan-900/10" : "border-slate-200 bg-white hover:border-cyan-200"}`}
          >
            <p className="text-xl font-semibold">普通用户</p>
            <p className={`mt-2 text-sm leading-6 ${mode === "user" ? "text-slate-700" : "text-slate-600"}`}>
              浏览房源、发布转租信息、收藏感兴趣的房源。
            </p>
          </a>

          <a
            href="/login?mode=admin"
            className={`block rounded-[2rem] border-2 p-5 shadow-sm transition ${mode === "admin" ? "border-emerald-400 bg-emerald-50 text-slate-900 shadow-emerald-900/10" : "border-slate-200 bg-white hover:border-emerald-200"}`}
          >
            <p className="text-xl font-semibold">管理员</p>
            <p className={`mt-2 text-sm leading-6 ${mode === "admin" ? "text-slate-700" : "text-slate-600"}`}>
              审核房源内容，维护平台信息质量。
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
