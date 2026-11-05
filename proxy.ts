import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/** First line of defence for /admin. Pages and actions re-check with getServerSession. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.isAdmin) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
