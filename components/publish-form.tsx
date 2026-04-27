"use client";

import { useState } from "react";
import type { School } from "@/lib/types";

const MAX_IMAGE_COUNT = 9;
const MAX_UPLOAD_CONCURRENCY = 3;
const MAX_COMPRESSED_WIDTH = 1600;
const IMAGE_QUALITY = 0.78;

function getCompressedFileName(fileName: string) {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "");
  return `${withoutExtension || "listing-image"}.jpg`;
}

async function compressImageFile(file: File) {
  if (!file.type.startsWith("image/")) return file;
  if (file.type === "image/gif") return file;

  const imageBitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_COMPRESSED_WIDTH / imageBitmap.width);
  const width = Math.round(imageBitmap.width * scale);
  const height = Math.round(imageBitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return file;

  context.drawImage(imageBitmap, 0, 0, width, height);
  imageBitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", IMAGE_QUALITY);
  });

  if (!blob || blob.size >= file.size) return file;

  return new File([blob], getCompressedFileName(file.name), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  task: (item: T, index: number) => Promise<void>,
) {
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      await task(items[currentIndex], currentIndex);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
}

async function readJsonResponse<T>(response: Response, fallbackError: string): Promise<T & { error?: string }> {
  const raw = await response.text();

  if (!raw) {
    return {
      error: response.ok ? undefined : fallbackError,
    } as T & { error?: string };
  }

  try {
    return JSON.parse(raw) as T & { error?: string };
  } catch {
    return {
      error: response.ok ? fallbackError : `${fallbackError}. The server returned a non-JSON response.`,
    } as T & { error?: string };
  }
}

export function PublishForm({ schools }: { schools: School[] }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setUploadProgress("");

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, FormDataEntryValue | string[]> = Object.fromEntries(formData.entries());

    const files = formData
      .getAll("imageFiles")
      .filter((file): file is File => file instanceof File && file.size > 0)
      .slice(0, MAX_IMAGE_COUNT);

    if (files.length > 0) {
      setUploading(true);
      setUploadProgress(`Processing ${files.length} image(s)...`);

      try {
        const compressedFiles = await Promise.all(files.map((file) => compressImageFile(file)));
        const imageUrls = new Array<string>(compressedFiles.length);
        let uploadedCount = 0;

        await runWithConcurrency(compressedFiles, MAX_UPLOAD_CONCURRENCY, async (file, index) => {
          const uploadFormData = new FormData();
          uploadFormData.set("file", file);

          const uploadResponse = await fetch("/api/uploads/listing-image", {
            method: "POST",
            body: uploadFormData,
          });

          const uploadData = await readJsonResponse<{
            error?: string;
            data?: { publicUrl?: string };
          }>(uploadResponse, "Image upload failed");

          if (!uploadResponse.ok || !uploadData.data?.publicUrl) {
            throw new Error(uploadData.error ?? "Image upload failed");
          }

          imageUrls[index] = uploadData.data.publicUrl;
          uploadedCount += 1;
          setUploadProgress(`Uploading images: ${uploadedCount} / ${compressedFiles.length}`);
        });

        payload.imageUrls = imageUrls;
        setUploadProgress("Image upload complete. Saving listing...");
      } catch (uploadError) {
        setUploading(false);
        setUploadProgress("");
        setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
        return;
      }
    }

    delete payload.imageFiles;

    const response = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await readJsonResponse<{ error?: string; message?: string }>(response, "Submission failed");
    if (!response.ok) {
      setUploading(false);
      setUploadProgress("");
      setError(data.error ?? "Submission failed");
      return;
    }

    setUploading(false);
    setUploadProgress("");
    setMessage(data.message ?? "Submitted successfully");
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border-2 border-violet-100 bg-white p-6 shadow-sm shadow-violet-900/5">
        <input name="title" placeholder="Title" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
        <textarea name="description" placeholder="Description" className="min-h-32 rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
        <div className="grid gap-4 md:grid-cols-3">
          <input name="city" placeholder="City" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
          <input name="area" placeholder="Area" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
          <input name="address" placeholder="Full address" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <select name="schoolId" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" defaultValue="">
            <option value="">School</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name} ({school.city})
              </option>
            ))}
          </select>
          <input name="rent" placeholder="Rent ($/month)" type="number" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
          <input name="distanceToSchool" placeholder="Distance to school, e.g. 0.8 km" type="number" step="0.1" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
        </div>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <fieldset className="rounded-2xl border border-violet-200 px-4 py-3">
            <legend className="px-2 text-sm font-medium text-slate-500">Availability</legend>
            <div className="grid gap-3 md:grid-cols-2">
              <input name="moveInDate" type="date" aria-label="Start date" className="rounded-xl border border-violet-200 px-3 py-2 focus:border-violet-500 focus:outline-none" />
              <input name="availableUntil" type="date" aria-label="End date" className="rounded-xl border border-violet-200 px-3 py-2 focus:border-violet-500 focus:outline-none" />
            </div>
          </fieldset>
          <select name="type" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" defaultValue="">
            <option value="">Listing type</option>
            <option value="shared">Private room</option>
            <option value="sublet">Entire place</option>
          </select>
          <select name="housingType" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" defaultValue="">
            <option value="">Layout</option>
            <option value="Studio">Studio</option>
            <option value="1B1B">1B1B</option>
            <option value="2B1B">2B1B</option>
            <option value="2B2B">2B2B</option>
            <option value="3B2B">3B2B</option>
            <option value="3B3B">3B3B</option>
            <option value="4B1B">4B1B</option>
            <option value="4B2B">4B2B</option>
            <option value="4B3B">4B3B</option>
            <option value="4B4B">4B4B</option>
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <select name="officialSublease" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" defaultValue="">
            <option value="">Official sublease</option>
            <option value="yes">Yes</option>
            <option value="undecided">Pending confirmation</option>
          </select>
          <input name="acceptableMinPrice" placeholder="Minimum acceptable price" type="number" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
          <input name="acceptableMaxPrice" placeholder="Maximum acceptable price" type="number" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <select name="petPolicy" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" defaultValue="">
            <option value="">Pet policy</option>
            <option value="accept">Pets allowed</option>
            <option value="not_accept">No pets</option>
          </select>
          <input name="contactEmail" placeholder="Contact email" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
          <input name="contactWechat" placeholder="Phone / WeChat" className="rounded-2xl border border-violet-200 px-4 py-3 focus:border-violet-500 focus:outline-none" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex min-h-[54px] items-center rounded-2xl border border-violet-200 px-4 py-3 text-sm text-slate-500">
            <span className="mr-4 whitespace-nowrap font-medium text-slate-700">Listing photos</span>
            <input
              type="file"
              name="imageFiles"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="w-full"
            />
          </label>
        </div>
        <p className="text-sm text-slate-500">Upload up to 9 JPG, PNG, or WEBP images. Each image must be under 5MB.</p>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        {uploadProgress ? <p className="text-sm font-medium text-cyan-700">{uploadProgress}</p> : null}
        <button disabled={uploading} className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-3 font-medium text-white shadow-sm shadow-violet-900/20 transition hover:from-violet-700 hover:to-cyan-700 disabled:opacity-60">
          {uploading ? uploadProgress || "Uploading images..." : "Submit for review"}
        </button>
      </form>
    </div>
  );
}
