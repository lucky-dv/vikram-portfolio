"use client";

export type Uploaded = { url: string; width?: number; height?: number };

/** Longest edge we keep. Articles render at most ~1080 CSS px wide, so this covers 2x screens. */
const MAX_EDGE = 2400;

/**
 * Downscale large photos in the browser before upload, so readers on phones aren't served
 * 8 MB originals. GIFs are left alone (re-encoding would drop the animation), and the original
 * is kept whenever re-encoding wouldn't actually make it smaller.
 */
async function prepare(file: File): Promise<{ file: File; width?: number; height?: number }> {
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file);
  } catch {
    return { file }; // the server still validates type and size
  }
  const { width, height } = bmp;
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  if (file.type === "image/gif" || (scale === 1 && file.size < 1.5 * 1024 * 1024)) {
    bmp.close();
    return { file, width, height };
  }

  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  bmp.close();

  const encode = (type: string) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, 0.86));
  let blob = await encode("image/webp");
  // Browsers without WebP encoding fall back to PNG; JPEG is fine only for sources without transparency.
  if (blob?.type !== "image/webp") blob = file.type === "image/jpeg" ? await encode("image/jpeg") : null;
  if (!blob || blob.size >= file.size) return { file, width, height };

  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const name = file.name.replace(/\.[a-z0-9]+$/i, "") + "." + ext;
  return { file: new File([blob], name, { type: blob.type }), width: w, height: h };
}

export async function uploadImage(original: File): Promise<Uploaded> {
  const { file, width, height } = await prepare(original);
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error("You've been signed out. Sign in again in another tab, then retry.");
  if (!res.ok || !body.url) throw new Error(body.error || "Upload failed");
  return { url: body.url as string, width, height };
}
