"use client";

import { useState } from "react";
import type { School } from "@/lib/types";

export function PublishForm({ schools }: { schools: School[] }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const file = formData.get("imageFile");
    if (file instanceof File && file.size > 0) {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.set("file", file);

      const uploadResponse = await fetch("/api/uploads/listing-image", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadData = (await uploadResponse.json()) as {
        error?: string;
        data?: { publicUrl?: string };
      };

      if (!uploadResponse.ok || !uploadData.data?.publicUrl) {
        setUploading(false);
        setError(uploadData.error ?? "图片上传失败");
        return;
      }

      payload.imageUrl = uploadData.data.publicUrl;
      setUploading(false);
    }

    delete payload.imageFile;

    const response = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await response.text();
    const data = raw ? (JSON.parse(raw) as { error?: string; message?: string }) : {};
    if (!response.ok) {
      setUploading(false);
      setError(data.error ?? "提交失败");
      return;
    }

    setUploading(false);
    setMessage(data.message ?? "提交成功");
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border-2 border-violet-100 bg-white p-6 shadow-sm shadow-violet-900/5">
        <input name="title" placeholder="标题" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
        <textarea name="description" placeholder="描述" className="min-h-32 rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
        <div className="grid gap-4 md:grid-cols-3">
          <input name="city" placeholder="城市" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
          <input name="area" placeholder="区域" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
          <input name="address" placeholder="详细地址" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <select name="schoolId" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" defaultValue="">
            <option value="">选择学校</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name} ({school.city})
              </option>
            ))}
          </select>
          <input name="rent" placeholder="月租金" type="number" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
          <input name="distanceToSchool" placeholder="离学校距离，例如 0.8 km" type="number" step="0.1" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
        </div>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <fieldset className="rounded-2xl border border-violet-200 px-4 py-3">
            <legend className="px-2 text-sm font-medium text-slate-500">出租时限</legend>
            <div className="grid gap-3 md:grid-cols-2">
              <input name="moveInDate" type="date" aria-label="出租开始日期" className="rounded-xl border border-violet-200 px-3 py-2 focus:border-violet-500 focus:outline-none" />
              <input name="availableUntil" type="date" aria-label="出租结束日期" className="rounded-xl border border-violet-200 px-3 py-2 focus:border-violet-500 focus:outline-none" />
            </div>
          </fieldset>
          <select name="type" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" defaultValue="">
            <option value="">出租类型</option>
            <option value="sublet">整套转租</option>
            <option value="shared">单间转租</option>
            <option value="entire">整租</option>
          </select>
          <select name="floorPlan" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" defaultValue="">
            <option value="" disabled>房型</option>
            <option value="Studio">Studio</option>
            <option value="1B1B">1B1B</option>
            <option value="2B1B">2B1B</option>
            <option value="2B2B">2B2B</option>
            <option value="3B1B">3B1B</option>
            <option value="4B4B">4B4B</option>
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="contactEmail" placeholder="联系邮箱" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
          <input name="contactWechat" placeholder="联系微信" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex min-h-[54px] items-center rounded-2xl border border-violet-200 px-4 py-3 text-sm text-slate-500">
            <span className="mr-4 whitespace-nowrap font-medium text-slate-700">上传房源图片</span>
            <input
              type="file"
              name="imageFile"
              accept="image/png,image/jpeg,image/webp"
              className="w-full"
            />
          </label>
        </div>
        <p className="text-sm text-slate-500">支持上传 JPG、PNG、WEBP，本地图片大小不超过 5MB。</p>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        <button disabled={uploading} className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-3 font-medium text-white shadow-sm shadow-violet-900/20 transition hover:from-violet-700 hover:to-cyan-700 disabled:opacity-60">
          {uploading ? "上传图片中..." : "提交审核"}
        </button>
      </form>
    </div>
  );
}
