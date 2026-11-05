"use client";

import { Eye, EyeOff, FileText, Pencil, Search, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { deletePost, setPostStatus } from "@/app/admin/actions";

type Row = {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  coverImage: string | null;
  readingMinutes: number;
  publishedAt: string | null;
  updatedAt: string;
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function PostsTable({ posts }: { posts: Row[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, start] = useTransition();

  const counts = useMemo(
    () => ({
      ALL: posts.length,
      PUBLISHED: posts.filter((p) => p.status === "PUBLISHED").length,
      DRAFT: posts.filter((p) => p.status === "DRAFT").length,
    }),
    [posts]
  );

  const rows = posts.filter(
    (p) =>
      (filter === "ALL" || p.status === filter) &&
      (p.title.toLowerCase().includes(q.toLowerCase()) || p.slug.includes(q.toLowerCase()))
  );

  const run = (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    start(async () => {
      await fn();
      setBusyId(null);
      setConfirmId(null);
      router.refresh();
    });
  };

  return (
    <div className="adm-card">
      <div className="adm-card-head">
        <div>
          <h1 className="adm-h1">Posts</h1>
          <p className="adm-muted">Write, publish and manage everything on vikramparekh.com/writing.</p>
        </div>
        <a href="/admin/posts/new" className="adm-btn adm-btn-primary">
          New post
        </a>
      </div>

      <div className="adm-toolbar">
        <div className="adm-tabs" role="tablist">
          {(["ALL", "PUBLISHED", "DRAFT"] as const).map((f) => (
            <button key={f} role="tab" aria-selected={filter === f} className={filter === f ? "is-on" : ""} onClick={() => setFilter(f)}>
              {f === "ALL" ? "All" : f === "PUBLISHED" ? "Published" : "Drafts"} <span>{counts[f]}</span>
            </button>
          ))}
        </div>
        <label className="adm-search">
          <Search size={14} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts" />
        </label>
      </div>

      {rows.length === 0 ? (
        <div className="adm-empty">
          <FileText size={28} />
          <p>{posts.length ? "No posts match." : "No posts yet. Write the first one."}</p>
          {!posts.length && (
            <a href="/admin/posts/new" className="adm-btn adm-btn-primary">
              Start writing
            </a>
          )}
        </div>
      ) : (
        <ul className="adm-list">
          {rows.map((p) => (
            <li key={p.id} className={busyId === p.id ? "is-busy" : ""}>
              <a href={`/admin/posts/${p.id}`} className="adm-row-main">
                <span className="adm-thumb">
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.coverImage} alt="" />
                  ) : (
                    <FileText size={16} />
                  )}
                </span>
                <span className="adm-row-text">
                  <span className="adm-row-title">
                    {p.featured && <Star size={13} className="adm-star" aria-label="Featured" />}
                    {p.title || "Untitled"}
                  </span>
                  <span className="adm-row-meta">
                    <span className={`adm-pill ${p.status === "PUBLISHED" ? "is-live" : ""}`}>
                      {p.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                    <span className="hide-sm">/writing/{p.slug} ·</span> {p.readingMinutes} min ·{" "}
                    {p.status === "PUBLISHED" && p.publishedAt ? `published ${fmt(p.publishedAt)}` : `edited ${fmt(p.updatedAt)}`}
                  </span>
                </span>
              </a>

              <div className="adm-row-actions">
                {confirmId === p.id ? (
                  <>
                    <span className="adm-muted sm">Delete for good?</span>
                    <button className="adm-btn adm-btn-danger sm" onClick={() => run(p.id, () => deletePost(p.id))}>
                      Delete
                    </button>
                    <button className="adm-btn adm-btn-ghost sm" onClick={() => setConfirmId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {p.status === "PUBLISHED" && (
                      <a className="adm-icon-btn" href={`/writing/${p.slug}`} target="_blank" title="View live">
                        <Eye size={15} /> <span className="adm-act-label">View</span>
                      </a>
                    )}
                    <button
                      className="adm-icon-btn"
                      title={p.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      onClick={() => run(p.id, () => setPostStatus(p.id, p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"))}
                    >
                      {p.status === "PUBLISHED" ? <EyeOff size={15} /> : <Eye size={15} />}
                      <span className="adm-act-label">{p.status === "PUBLISHED" ? "Unpublish" : "Publish"}</span>
                    </button>
                    <a className="adm-icon-btn" href={`/admin/posts/${p.id}`} title="Edit">
                      <Pencil size={15} /> <span className="adm-act-label">Edit</span>
                    </a>
                    <button className="adm-icon-btn danger" title="Delete" onClick={() => setConfirmId(p.id)}>
                      <Trash2 size={15} /> <span className="adm-act-label">Delete</span>
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
