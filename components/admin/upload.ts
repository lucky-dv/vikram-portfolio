"use client";

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.url) throw new Error(body.error || "Upload failed");
  return body.url as string;
}
