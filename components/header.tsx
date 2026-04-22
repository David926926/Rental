import Link from "next/link";
import { getSessionUser } from "@/lib/session";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/listings", label: "浏览房源" },
  { href: "/publish", label: "发布房源" },
];

export async function Header() {
  const session = await getSessionUser();

  return (
    <header className="border-b border-black/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900">
          DormEx
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {session ? (
            <>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {session.name} · {session.role}
              </span>
              <Link href="/profile" className="text-slate-600 hover:text-slate-900">
                个人中心
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/register" className="rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-900 transition hover:bg-slate-50">
                普通用户注册
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-cyan-600 to-violet-600 px-4 py-2 font-medium text-white shadow-sm shadow-violet-900/20 transition hover:from-cyan-700 hover:to-violet-700"
              >
                登录入口
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
