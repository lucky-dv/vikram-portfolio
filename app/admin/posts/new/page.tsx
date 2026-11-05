import type { Metadata } from "next";
import AdminBar from "@/components/admin/AdminBar";
import PostForm from "@/components/admin/PostForm";
import { requireAdminPage } from "@/lib/admin";

export const metadata: Metadata = { title: "New post" };

export default async function NewPost() {
  const user = await requireAdminPage();
  return (
    <>
      <AdminBar email={user.email} />
      <PostForm />
    </>
  );
}
