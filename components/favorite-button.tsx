"use client";

import { useState } from "react";

export function FavoriteButton({ listingId }: { listingId: string }) {
  const [message, setMessage] = useState("");

  async function handleClick() {
    const response = await fetch(`/api/listings/${listingId}/favorite`, { method: "POST" });
    const data = (await response.json()) as { error?: string; message?: string };
    setMessage(data.message ?? data.error ?? "");
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 font-medium text-slate-900"
      >
        Save listing
      </button>
      {message ? <p className="text-sm text-slate-500">{message}</p> : null}
    </div>
  );
}
