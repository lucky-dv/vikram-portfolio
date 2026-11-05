"use client";

import { signOut } from "next-auth/react";
import { ExternalLink, LogOut, PenLine } from "lucide-react";

export default function AdminBar({ email }: { email?: string | null }) {
  return (
    <header className="adm-bar">
      <a href="/admin/posts" className="adm-brand">
        <span className="adm-mark sm">VP</span>
        <span className="hide-xs">Writing desk</span>
      </a>
      <nav className="adm-bar-nav">
        <a href="/admin/posts/new" className="adm-btn adm-btn-primary sm">
          <PenLine size={14} /> <span className="hide-sm">New post</span><span className="show-sm">New</span>
        </a>
        <a href="/writing" target="_blank" className="adm-btn adm-btn-ghost sm" title="View site">
          <ExternalLink size={14} /> <span className="hide-sm">View site</span>
        </a>
        <span className="adm-user hide-sm" title={email ?? ""}>{email}</span>
        <button className="adm-icon-btn" title="Sign out" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
          <LogOut size={15} />
        </button>
      </nav>
    </header>
  );
}
