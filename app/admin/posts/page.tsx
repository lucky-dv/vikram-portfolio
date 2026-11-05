import type { Metadata } from "next";
import AdminBar from "@/components/admin/AdminBar";
import PostsTable from "@/components/admin/PostsTable";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Posts" };
export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const user = await requireAdminPage();
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, title: true, slug: true, status: true, featured: true, coverImage: true,
      readingMinutes: true, publishedAt: true, updatedAt: true,
    },
  });

  return (
    <>
      <AdminBar email={user.email} />
      <main className="adm-main">
        <PostsTable
          posts={posts.map((p) => ({
            ...p,
            publishedAt: p.publishedAt?.toISOString() ?? null,
            updatedAt: p.updatedAt.toISOString(),
          }))}
        />
      </main>
    </>
  );
}
