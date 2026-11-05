"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt(text.includes("@") ? "Copy email address:" : "Copy phone number:", text);
    }
  };

  return (
    <button className="copy" type="button" onClick={onClick} aria-live="polite">
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
