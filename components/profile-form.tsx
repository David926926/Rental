"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { School, User } from "@/lib/types";

export function ProfileForm({
  user,
  schools,
}: {
  user: User;
  schools: School[];
}) {
  const router = useRouter();
  const [schoolId, setSchoolId] = useState(user.schoolId ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [wechat, setWechat] = useState(user.wechat ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        schoolId,
        phone,
        wechat,
      }),
    });

    const data = (await response.json()) as { error?: string; message?: string };
    if (!response.ok) {
      setError(data.error ?? "Failed to update profile");
      setSaving(false);
      return;
    }

    setMessage(data.message ?? "Profile updated successfully");
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900">Edit profile details</h2>
        <p className="mt-2 text-sm text-slate-600">
          Add your school and preferred contact info so your profile is actually useful.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">School</label>
          <select
            value={schoolId}
            onChange={(event) => setSchoolId(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name} ({school.city})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Your phone number"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">WeChat</label>
          <input
            value={wechat}
            onChange={(event) => setWechat(event.target.value)}
            placeholder="Your WeChat ID"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
          />
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 rounded-full bg-gradient-to-r from-cyan-600 to-violet-600 px-5 py-3 font-medium text-white shadow-sm shadow-violet-900/20 transition hover:from-cyan-700 hover:to-violet-700 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
