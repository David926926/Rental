"use client";

import { useState } from "react";

export function ContactForm({ listingId }: { listingId: string }) {
  const [message, setMessage] = useState("你好，我对这个房源感兴趣，想了解更多细节。");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`/api/listings/${listingId}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = (await response.json()) as { error?: string; message?: string };
    setFeedback(data.message ?? data.error ?? "提交失败");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">留言联系</h3>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
      />
      {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}
      <button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white">
        发送联系请求
      </button>
    </form>
  );
}
