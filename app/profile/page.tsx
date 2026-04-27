import { redirect } from "next/navigation";
import { getSchools, getUserById } from "@/lib/repository";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const user = await getUserById(session.id);
  const schools = await getSchools();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{user?.name}</h1>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p><span className="font-medium text-slate-900">Email: </span>{user?.email}</p>
            <p><span className="font-medium text-slate-900">School: </span>{schools.find((item) => item.id === user?.schoolId)?.name ?? "Not provided"}</p>
            <p><span className="font-medium text-slate-900">Phone: </span>{user?.phone ?? "Not provided"}</p>
            <p><span className="font-medium text-slate-900">WeChat: </span>{user?.wechat ?? "Not provided"}</p>
          </div>
          <form action="/api/auth/logout" method="POST" className="mt-6">
            <button className="rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-900">
              Log out
            </button>
          </form>
      </section>
    </div>
  );
}
