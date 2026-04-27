"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Your name"
          autoComplete="name"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Confirm password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Enter your password again"
          autoComplete="new-password"
        />
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <button
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-violet-600 px-4 py-3 font-medium text-white shadow-sm shadow-violet-900/20 transition hover:from-cyan-700 hover:to-violet-700 disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Sign up and log in"}
      </button>
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Already have an account?</span>
        <Link href="/login" className="font-medium text-slate-900 hover:text-emerald-700">
          Log in
        </Link>
      </div>
    </form>
  );
}
