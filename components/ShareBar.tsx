"use client";

import { useState } from "react";

export default function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  return (
    <div className="share">
      <span className="label">Share</span>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener">LinkedIn</a>
      <a href={`https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}`} target="_blank" rel="noopener">X</a>
      <a href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noopener">WhatsApp</a>
      <button
        type="button"
        className="copy"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {}
        }}
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
