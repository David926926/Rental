"use client";

import { useState } from "react";

export function AdminReviewForm({ listingId }: { listingId: string }) {
  const [status, setStatus] = useState("approved");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`/api/admin/listings/${listingId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note }),
    });
    const data = (await response.json()) as { error?: string; message?: string };
    setMessage(data.message ?? data.error ?? "");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3"
      >
        <option value="approved">Approve</option>
        <option value="rejected">Reject</option>
        <option value="flagged">Flag risk</option>
        <option value="removed">Remove</option>
      </select>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Review note"
        className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3"
      />
      {message ? <p className="text-sm text-slate-500">{message}</p> : null}
      <button className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-3 font-medium text-white shadow-sm shadow-emerald-900/20 transition hover:from-emerald-700 hover:to-cyan-700">Submit review</button>
    </form>
  );
}
