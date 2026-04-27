"use client";

import { useState } from "react";

export function ContactForm({ listingId }: { listingId: string }) {
  const [message, setMessage] = useState("Hi, I'm interested in this listing and would like to learn more details.");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`/api/listings/${listingId}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = (await response.json()) as { error?: string; message?: string };
    setFeedback(data.message ?? data.error ?? "Submission failed");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Send a message</h3>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
      />
      {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}
      <button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white">
        Send contact request
      </button>
    </form>
  );
}
