import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * First line of defence for /admin. Pages and actions re-check with getServerSession.
 *
 * The session cookie is named `__Secure-next-auth.session-token` on https and
 * `next-auth.session-token` on http. Pick the name from the actual request rather than
 * from NEXTAUTH_URL; a mismatch here makes this guard and the login page disagree about
 * whether you're signed in, which sends the browser into a redirect loop.
 */
async function readToken(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const https =
    request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto")?.split(",")[0] === "https";
  return (
    (await getToken({ req: request, secret, secureCookie: https })) ??
    (await getToken({ req: request, secret, secureCookie: !https }))
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = await readToken(request);
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
