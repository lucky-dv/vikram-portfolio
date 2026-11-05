import "server-only";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

export async function getAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.isAdmin ? session.user : null;
}

/** Server components: bounce to login when not an admin. */
export async function requireAdminPage() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

/** Server actions / route handlers: throw when not an admin. */
export async function assertAdmin() {
  const user = await getAdmin();
  if (!user) throw new Error("Admin access required");
  return user;
}
