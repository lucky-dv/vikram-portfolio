"use client";

import { ArrowLeft, Check, ExternalLink, Globe, ImagePlus, Loader2, Save, Settings2, Sparkles, Trash2, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPost, deletePost, suggestSeo, updatePost, type PostInput } from "@/app/admin/actions";
import { uploadImage } from "./upload";

const Editor = dynamic(() => import("./Editor"), { ssr: false, loading: () => <div className="adm-editor-skeleton" /> });

type Initial = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  coverPosition: string;
  coverHeight: number;
  seoTitle: string;
  seoDescription: string;
  seoAuto: boolean;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string;
};

const EMPTY: Omit<Initial, "id"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  coverAlt: "",
  coverPosition: "center center",
  coverHeight: 640,
  seoTitle: "",
  seoDescription: "",
  seoAuto: true,
  featured: false,
  status: "DRAFT",
  publishedAt: "",
};

const FOCAL = [
  "top left", "top center", "top right",
  "center left", "center center", "center right",
  "bottom left", "bottom center", "bottom right",
];

const toSlug = (t: string) =>
  t.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80);

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://vikramparekh.com").replace(/^https?:\/\//, "");

export default function PostForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [id, setId] = useState(initial?.id);
  const [v, setV] = useState<Omit<Initial, "id">>(initial ?? EMPTY);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState<null | "DRAFT" | "PUBLISHED">(null);
  const [coverBusy, setCoverBusy] = useState(false);
  const [panel, setPanel] = useState(false);
  const [toast, setToast] = useState<{ msg: string; tone: "ok" | "err" } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const uploads = useRef<Set<string>>(new Set());
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const set = useCallback(<K extends keyof typeof v>(k: K, val: (typeof v)[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    setDirty(true);
  }, []);

  const notify = useCallback((msg: string, tone: "ok" | "err" = "ok") => {
    setToast({ msg, tone });
    window.setTimeout(() => setToast(null), 2800);
  }, []);

  // autosize title / dek
  const grow = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  useEffect(() => grow(titleRef.current), [v.title]);

  // Warn before leaving with unsaved changes; best-effort cleanup of orphaned uploads
  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      if (uploads.current.size) {
        navigator.sendBeacon?.("/api/admin/cleanup", new Blob([JSON.stringify({ urls: [...uploads.current] })], { type: "application/json" }));
      }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [dirty]);

  const save = useCallback(
    async (status: "DRAFT" | "PUBLISHED") => {
      if (!v.title.trim()) return notify("Add a title first.", "err");
      if (!v.content || v.content === "<p></p>") return notify("Write something first.", "err");
      setSaving(status);
      const input: PostInput = { ...v, slug: v.slug || toSlug(v.title), status };
      const res = id ? await updatePost(id, input) : await createPost(input);
      setSaving(null);
      if (!res.ok) return notify(res.error, "err");
      uploads.current.clear();
      setDirty(false);
      setV((p) => ({ ...p, status, slug: res.slug, seoTitle: res.seoTitle ?? "", seoDescription: res.seoDescription ?? "", seoAuto: res.seoAuto }));
      notify(status === "PUBLISHED" ? (v.status === "PUBLISHED" ? "Changes are live." : "Published. It's live.") : "Draft saved.");
      if (!id) {
        setId(res.id);
        router.replace(`/admin/posts/${res.id}`);
      } else router.refresh();
    },
    [v, id, notify, router]
  );

  // ⌘S / Ctrl+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save(v.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save, v.status]);

  const discard = async () => {
    if (dirty && !window.confirm("Leave without saving? Unsaved changes will be lost.")) return;
    if (uploads.current.size) {
      await fetch("/api/admin/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [...uploads.current] }),
        keepalive: true,
      }).catch(() => {});
    }
    setDirty(false);
    router.push("/admin/posts");
  };

  const onCover = async (file?: File) => {
    if (!file) return;
    setCoverBusy(true);
    try {
      const url = await uploadImage(file);
      uploads.current.add(url);
      set("coverImage", url);
      if (!v.coverAlt) set("coverAlt", v.title);
    } catch (e) {
      notify((e as Error).message, "err");
    } finally {
      setCoverBusy(false);
    }
  };

  const [seoBusy, setSeoBusy] = useState(false);
  const regenerateSeo = async () => {
    setSeoBusy(true);
    const res = await suggestSeo({ title: v.title, excerpt: v.excerpt, content: v.content });
    setSeoBusy(false);
    if ("error" in res) return notify(res.error, "err");
    setV((p) => ({ ...p, seoTitle: res.seoTitle, seoDescription: res.seoDescription, seoAuto: true }));
    setDirty(true);
    notify(res.source === "ai" ? "SEO title and description written." : "Filled from the title and summary.");
  };

  const seoTitle = v.seoTitle || v.title || "Post title";
  const seoDesc = v.seoDescription || v.excerpt || "A short summary appears here in search results.";
  const live = v.status === "PUBLISHED";

  return (
    <div className="adm-compose">
      {toast && <div className={`adm-toast ${toast.tone === "err" ? "is-err" : ""}`} role="status">{toast.tone === "ok" ? <Check size={14} /> : <X size={14} />} {toast.msg}</div>}

      <div className="adm-compose-bar">
        <button className="adm-btn adm-btn-ghost sm" onClick={discard}>
          <ArrowLeft size={14} /> <span className="hide-sm">Posts</span>
        </button>
        <span className={`adm-pill ${live ? "is-live" : ""}`}>{live ? "Published" : "Draft"}</span>
        <span className="adm-saved hide-sm">{dirty ? "Unsaved changes" : id ? "All changes saved" : ""}</span>
        <div className="adm-compose-actions">
          {live && id && (
            <a className="adm-btn adm-btn-ghost sm" href={`/writing/${v.slug}`} target="_blank">
              <ExternalLink size={14} /> <span className="hide-sm">View</span>
            </a>
          )}
          <button className={`adm-btn sm ${panel ? "adm-btn-dark" : "adm-btn-ghost"}`} onClick={() => setPanel((p) => !p)} aria-label="Post settings" title="Post settings">
            <Settings2 size={14} /> <span className="hide-sm">Settings</span>
          </button>
          {live ? (
            <button className="adm-btn adm-btn-ghost sm" disabled={!!saving} onClick={() => save("DRAFT")} title="Move back to drafts">
              {saving === "DRAFT" ? <Loader2 size={14} className="spin" /> : <Save size={14} />} <span className="hide-sm">Unpublish</span>
            </button>
          ) : (
            <button className="adm-btn adm-btn-ghost sm" disabled={!!saving} onClick={() => save("DRAFT")}>
              {saving === "DRAFT" ? <Loader2 size={14} className="spin" /> : <Save size={14} />} <span className="hide-sm">Save draft</span><span className="show-sm">Save</span>
            </button>
          )}
          <button className="adm-btn adm-btn-primary sm" disabled={!!saving} onClick={() => save("PUBLISHED")}>
            {saving === "PUBLISHED" ? <Loader2 size={14} className="spin" /> : <Globe size={14} />} {live ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="adm-compose-body">
        <main className="adm-canvas">
          {/* Cover */}
          {v.coverImage ? (
            <figure className="adm-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.coverImage} alt={v.coverAlt} style={{ objectPosition: v.coverPosition, maxHeight: `min(${v.coverHeight}px, 75vh)` }} />
              <div className="adm-cover-tools">
                <label className="adm-btn adm-btn-light sm">
                  <ImagePlus size={14} /> Change
                  <input type="file" hidden accept="image/*" onChange={(e) => onCover(e.target.files?.[0])} />
                </label>
                <button className="adm-btn adm-btn-light sm" onClick={() => setPanel(true)}>
                  <Settings2 size={14} /> Position
                </button>
                <button className="adm-btn adm-btn-light sm" onClick={() => set("coverImage", "")}>
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </figure>
          ) : (
            <label
              className={`adm-cover-drop${coverBusy ? " is-busy" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onCover(e.dataTransfer.files?.[0]);
              }}
            >
              {coverBusy ? <Loader2 size={16} className="spin" /> : <ImagePlus size={16} />}
              {coverBusy ? "Uploading…" : "Add a cover image"}
              <span className="adm-muted sm">or drop one here</span>
              <input type="file" hidden accept="image/*" disabled={coverBusy} onChange={(e) => onCover(e.target.files?.[0])} />
            </label>
          )}

          <textarea
            ref={titleRef}
            className="adm-title"
            placeholder="Title"
            rows={1}
            value={v.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) setV((p) => ({ ...p, slug: toSlug(e.target.value) }));
            }}
          />
          <textarea
            className="adm-dek"
            placeholder="Subtitle / summary (optional). Shown under the title, in lists and in search results."
            rows={2}
            maxLength={400}
            value={v.excerpt}
            ref={(el) => grow(el)}
            onChange={(e) => {
              set("excerpt", e.target.value);
              grow(e.target);
            }}
          />

          <Editor
            content={v.content}
            onChange={(html) => set("content", html)}
            onUploaded={(url) => uploads.current.add(url)}
            onError={(m) => notify(m, "err")}
          />
        </main>

        {panel && (
          <>
            <div className="adm-scrim" onClick={() => setPanel(false)} />
            <aside className="adm-panel" aria-label="Post settings">
              <div className="adm-panel-head">
                <h2>Post settings</h2>
                <button className="adm-icon-btn" onClick={() => setPanel(false)} aria-label="Close">
                  <X size={16} />
                </button>
              </div>

              <Field label="URL">
                <div className="adm-affix">
                  <span>{SITE}/writing/</span>
                  <input
                    value={v.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", toSlug(e.target.value) + (e.target.value.endsWith("-") ? "-" : ""));
                    }}
                    onBlur={() => set("slug", toSlug(v.slug))}
                    placeholder="post-url"
                  />
                </div>
                {live && isEdit && initial?.slug !== v.slug && <p className="adm-hint warn">Changing a live URL breaks existing links to it.</p>}
              </Field>

              <Field label="Search & social preview">
                <div className="adm-serp">
                  <span className="adm-serp-url">{SITE} › writing › {v.slug || "post-url"}</span>
                  <span className="adm-serp-title">{seoTitle}</span>
                  <span className="adm-serp-desc">{seoDesc}</span>
                </div>
              </Field>
              <div className="adm-seo-head">
                <span className={`adm-pill ${v.seoAuto ? "is-live" : ""}`}>{v.seoAuto ? "Auto" : "Custom"}</span>
                <span className="adm-hint">
                  {v.seoAuto
                    ? live || v.seoTitle ? "Written for you from the article. Updates when the article changes." : "Written for you from the article when you publish."
                    : "You've edited these, so they won't change automatically."}
                </span>
                <button type="button" className="adm-btn adm-btn-ghost sm" disabled={seoBusy} onClick={regenerateSeo}>
                  {seoBusy ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />} {v.seoTitle ? "Regenerate" : "Generate"}
                </button>
              </div>
              <Field label="SEO title" hint={`${(v.seoTitle || v.title).length}/60`}>
                <input
                  className="adm-input"
                  maxLength={70}
                  value={v.seoTitle}
                  placeholder={v.seoAuto ? "Generated when you publish" : v.title}
                  onChange={(e) => { setV((p) => ({ ...p, seoTitle: e.target.value, seoAuto: false })); setDirty(true); }}
                />
              </Field>
              <Field label="Meta description" hint={`${(v.seoDescription || v.excerpt).length}/155`}>
                <textarea
                  className="adm-input"
                  rows={3}
                  maxLength={170}
                  value={v.seoDescription}
                  placeholder={v.seoAuto ? "Generated when you publish" : v.excerpt}
                  onChange={(e) => { setV((p) => ({ ...p, seoDescription: e.target.value, seoAuto: false })); setDirty(true); }}
                />
              </Field>

              {v.coverImage && (
                <>
                  <Field label="Cover alt text" hint="Describe the image for screen readers and search engines.">
                    <input className="adm-input" value={v.coverAlt} onChange={(e) => set("coverAlt", e.target.value)} />
                  </Field>
                  <Field label="Cover focal point" hint="Used only when the image is cropped by the max height.">
                    <div className="adm-focal">
                      {FOCAL.map((f) => (
                        <button key={f} title={f} className={v.coverPosition === f ? "is-on" : ""} onClick={() => set("coverPosition", f)}>
                          <i />
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label={`Max cover height · ${v.coverHeight}px`} hint="The image shows uncropped unless it's taller than this; then the focal point decides what stays.">
                    <input type="range" min={200} max={720} step={10} value={v.coverHeight} onChange={(e) => set("coverHeight", Number(e.target.value))} />
                  </Field>
                </>
              )}

              <Field label="Publish date" hint="Leave empty to use the moment you publish. Set it to back-date an essay.">
                <input className="adm-input" type="date" value={v.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
              </Field>

              <label className="adm-switch">
                <input type="checkbox" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} />
                <span />
                Feature this post (pins it to the top of the list)
              </label>

              <div className="adm-panel-foot">
                <button className="adm-btn adm-btn-ghost" disabled={!!saving} onClick={() => save("DRAFT")}>
                  {saving === "DRAFT" ? <Loader2 size={14} className="spin" /> : <Save size={14} />} {live ? "Unpublish" : "Save draft"}
                </button>
                <button className="adm-btn adm-btn-primary" disabled={!!saving} onClick={() => save("PUBLISHED")}>
                  {saving === "PUBLISHED" ? <Loader2 size={14} className="spin" /> : <Globe size={14} />} {live ? "Update" : "Publish"}
                </button>
              </div>

              {id && (
                <div className="adm-danger-zone">
                  {confirmDelete ? (
                    <>
                      <p>Delete this post and its images permanently?</p>
                      <div className="row">
                        <button
                          className="adm-btn adm-btn-danger sm"
                          onClick={async () => {
                            await deletePost(id);
                            setDirty(false);
                            router.push("/admin/posts");
                          }}
                        >
                          Delete post
                        </button>
                        <button className="adm-btn adm-btn-ghost sm" onClick={() => setConfirmDelete(false)}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <button className="adm-btn adm-btn-ghost sm danger" onClick={() => setConfirmDelete(true)}>
                      <Trash2 size={14} /> Delete post
                    </button>
                  )}
                </div>
              )}
            </aside>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>
      {children}
      {hint && <p className="adm-hint">{hint}</p>}
    </div>
  );
}
