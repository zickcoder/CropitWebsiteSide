import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Guard all /admin/* paths except /admin/login (the login page itself)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login")
  ) {
    const session = req.cookies.get("admin_session");
    if (!session?.value) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    // Full HMAC verification is done in the layout server component and each API route.
    // Middleware only checks cookie presence for a fast edge-layer redirect.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

