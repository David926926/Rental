"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function parseContact(contactMethod: string) {
  const emailMatch = contactMethod.match(/邮箱\s*([^/]+)/);
  const wechatMatch = contactMethod.match(/微信\s*([^/]+)/);

  return {
    email: emailMatch?.[1]?.trim() || "Not provided",
    phoneOrWechat: wechatMatch?.[1]?.trim() || "Not provided",
  };
}

export function ListingContactActions({ contactMethod }: { contactMethod: string }) {
  const [open, setOpen] = useState(false);
  const contact = useMemo(() => parseContact(contactMethod), [contactMethod]);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-2xl bg-gradient-to-r from-cyan-600 to-violet-600 px-5 py-4 text-base font-semibold text-white shadow-sm shadow-violet-900/20 transition hover:from-cyan-700 hover:to-violet-700"
        >
          查看联系方式
        </button>
        <Link
          href="/listings"
          className="rounded-2xl border border-slate-300 bg-white px-5 py-4 text-center text-base font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
        >
          返回列表
        </Link>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-950/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">联系方式</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">联系方式</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50"
              >
                关闭
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">邮箱</p>
                <p className="mt-2 break-words text-lg font-semibold text-slate-900">{contact.email}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">电话 / 微信</p>
                <p className="mt-2 break-words text-lg font-semibold text-slate-900">{contact.phoneOrWechat}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
