import { NextResponse, type NextRequest } from "next/server";
import { getAdmin } from "@/lib/admin";
import { BUCKET, PREFIX, supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function POST(request: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    const ext = TYPES[file.type];
    if (!ext) return NextResponse.json({ error: "Use JPEG, PNG, WebP, AVIF or GIF." }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "Image too large (max 8 MB)." }, { status: 400 });

    const d = new Date();
    const path = `${PREFIX}${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getTime()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const sb = supabaseAdmin();
    const { error } = await sb.storage
      .from(BUCKET)
      .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, cacheControl: "31536000", upsert: false });
    if (error) {
      console.error("[upload]", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
