import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getSupabaseServer, storageBucketName } from "@/lib/supabase-server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Please log in before uploading images" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please choose an image file to upload" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, and WEBP images are supported" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Image size must be 5MB or less" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const path = `listings/${session.id}/${Date.now()}-${crypto.randomUUID()}.${getFileExtension(file)}`;
    const supabaseServer = getSupabaseServer();

    const { error: uploadError } = await supabaseServer.storage
      .from(storageBucketName)
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json({ error: "Image upload failed. Please try again later." }, { status: 500 });
    }

    const { data } = supabaseServer.storage.from(storageBucketName).getPublicUrl(path);

    return NextResponse.json({
      message: "Image uploaded successfully",
      data: {
        path,
        publicUrl: data.publicUrl,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "The image upload service is temporarily unavailable. Please try again later." }, { status: 500 });
  }
}
