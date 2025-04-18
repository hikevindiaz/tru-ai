import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
// Add runtime declaration to ensure Node.js runtime
export const runtime = 'nodejs';

// Very simple middleware implementation
export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = Boolean(token);
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Update matcher to include all protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};