import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminBar from "@/components/admin/AdminBar";
import PostForm from "@/components/admin/PostForm";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Edit post" };
export const dynamic = "force-dynamic";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdminPage();
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <>
      <AdminBar email={user.email} />
      <PostForm
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImage: post.coverImage ?? "",
          coverAlt: post.coverAlt ?? "",
          coverPosition: post.coverPosition,
          coverHeight: post.coverHeight,
          seoTitle: post.seoTitle ?? "",
          seoDescription: post.seoDescription ?? "",
          featured: post.featured,
          status: post.status,
          publishedAt: post.publishedAt?.toISOString().slice(0, 10) ?? "",
        }}
      />
    </>
  );
}
