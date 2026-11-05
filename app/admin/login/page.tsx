import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin";
import SignInButton from "@/components/admin/SignInButton";

export const metadata: Metadata = { title: "Sign in" };

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function Login({ searchParams }: Props) {
  const { next, error } = await searchParams;
  if (await getAdmin()) redirect(next?.startsWith("/admin") ? next : "/admin/posts");

  return (
    <main className="adm-login">
      <div className="adm-login-card">
        <span className="adm-mark">VP</span>
        <p className="adm-eyebrow">Vikram Parekh · Admin</p>
        <h1>Welcome back</h1>
        <p className="adm-muted">Sign in with an authorised Google account to write and publish.</p>
        {error && (
          <p className="adm-alert" role="alert">
            {error === "AccessDenied" ? "This Google account isn't authorised for the admin." : "Sign-in failed. Try again."}
          </p>
        )}
        <SignInButton next={next?.startsWith("/admin") ? next : "/admin/posts"} />
      </div>
      <a className="adm-back" href="/">← Back to site</a>
    </main>
  );
}
