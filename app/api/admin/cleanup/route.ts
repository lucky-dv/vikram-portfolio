import { NextResponse, type NextRequest } from "next/server";
import { getAdmin } from "@/lib/admin";
import { BUCKET, ownPath, supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Deletes images uploaded during an editing session that was discarded. */
export async function POST(request: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const urls: string[] = Array.isArray(body?.urls) ? body.urls : [];
  const paths = urls.map((u) => (typeof u === "string" ? ownPath(u) : null)).filter((p): p is string => !!p);
  if (paths.length) await supabaseAdmin().storage.from(BUCKET).remove(paths);
  return NextResponse.json({ deleted: paths.length });
}
