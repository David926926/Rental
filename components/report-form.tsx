"use client";

import { useState } from "react";

export function ReportForm({ listingId }: { listingId: string }) {
  const [reason, setReason] = useState("This listing may be misleading or fake.");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, reason }),
    });

    const data = (await response.json()) as { error?: string; message?: string };
    setMessage(data.message ?? data.error ?? "");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Report listing</h3>
      <textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3"
      />
      {message ? <p className="text-sm text-slate-500">{message}</p> : null}
      <button className="w-full rounded-2xl bg-rose-600 px-4 py-3 font-medium text-white">
        Submit report
      </button>
    </form>
  );
}
