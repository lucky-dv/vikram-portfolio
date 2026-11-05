"use client";

import { useEffect, useState } from "react";
import { audienceKeys, audiences, type AudienceKey } from "@/lib/content";
import type { PostCard } from "@/lib/posts";
import PostList from "./PostList";

type Filter = AudienceKey | "all";
const isKey = (v: string | null): v is AudienceKey => !!v && audienceKeys.includes(v as AudienceKey);

/**
 * Audience chips + the post list. Posts with no audience set show under "All" only.
 * `syncUrl` (on /writing) keeps the choice in ?for=… so a filtered view can be linked to.
 */
export default function WritingFilter({
  items,
  limit,
  allLink = false,
  syncUrl = false,
  variant = "chips",
}: {
  items: PostCard[];
  limit?: number;
  allLink?: boolean;
  syncUrl?: boolean;
  /** "lines": the audiences themselves are the big section heading and act as the filter (homepage). */
  variant?: "chips" | "lines";
}) {
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!syncUrl) return;
    const v = new URLSearchParams(window.location.search).get("for");
    if (isKey(v)) setFilter(v);
  }, [syncUrl]);

  const choose = (f: Filter) => {
    setFilter(f);
    if (!syncUrl) return;
    const url = new URL(window.location.href);
    if (f === "all") url.searchParams.delete("for");
    else url.searchParams.set("for", f);
    window.history.replaceState(null, "", url);
  };

  const count = (k: AudienceKey) => items.filter((p) => p.audiences.includes(k)).length;
  const matching = filter === "all" ? items : items.filter((p) => p.audiences.includes(filter));
  const shown = limit ? matching.slice(0, limit) : matching;
  const allHref = filter === "all" ? "/writing" : `/writing?for=${filter}`;

  const current = audiences.find((a) => a.key === filter);
  const plural = (n: number) => `${n} ${n === 1 ? "post" : "posts"}`;

  if (variant === "lines") {
    return (
      <>
        <div className="wf-lines" role="group" aria-labelledby="writing-h">
          {audiences.map((a, i) => {
            const on = filter === a.key;
            return (
              <button
                key={a.key}
                type="button"
                className="wf-line"
                aria-pressed={on}
                onClick={() => choose(on ? "all" : a.key)}
              >
                <span className="wf-line-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="wf-line-text">{a.label}</span>
                <span className="wf-line-count">{plural(count(a.key))}</span>
              </button>
            );
          })}
        </div>
        <div className="wf-meta">
          <span className="muted">
            {current ? (
              <>
                Showing writing for {current.label}.{" "}
                <button type="button" className="wf-reset" onClick={() => choose("all")}>
                  Show all
                </button>
              </>
            ) : (
              "Pick who you are to see what's written for you."
            )}
          </span>
          {allLink && (
            <a className="plain wf-all" href={allHref}>
              All writing <span className="arrow" aria-hidden="true">→</span>
            </a>
          )}
        </div>
        <div aria-live="polite" className="wf-results">
          {shown.length ? (
            <PostList key={filter} items={shown} />
          ) : (
            <p className="muted wf-empty">Nothing published for {current?.label} yet.</p>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="wf-bar">
        <div className="wf-chips" role="group" aria-label="Show writing for">
          <button type="button" className="wf-chip" aria-pressed={filter === "all"} onClick={() => choose("all")}>
            All <span className="wf-n">{items.length}</span>
          </button>
          {audiences.map((a) => {
            const n = count(a.key);
            return (
              <button
                key={a.key}
                type="button"
                className="wf-chip"
                aria-pressed={filter === a.key}
                onClick={() => choose(a.key)}
                title={a.label}
              >
                {a.short} <span className="wf-n">{n}</span>
              </button>
            );
          })}
        </div>
        {allLink && (
          <a className="plain wf-all" href={allHref}>
            All writing <span className="arrow" aria-hidden="true">→</span>
          </a>
        )}
      </div>
      <div aria-live="polite" className="wf-results">
        {shown.length ? (
          <PostList key={filter} items={shown} />
        ) : (
          <p className="muted wf-empty">Nothing published for {audiences.find((a) => a.key === filter)?.label} yet.</p>
        )}
      </div>
    </>
  );
}
