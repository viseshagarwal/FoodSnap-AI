import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/api/meals", "/api/images", "/api/gemini"];
const authRoutes = ["/login", "/register"];

// Protected routes that require email verification
const PROTECTED_ROUTES = [
  '/dashboard/meals/add',
  '/dashboard/goals/add',
];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const jwtToken = request.cookies.get("token");

  // Check if the path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Check if the path is an auth route
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !token && !jwtToken) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users to dashboard if they try to access auth routes
  if (isAuthRoute && (token || jwtToken)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Only check protected routes that require email verification
  if (!PROTECTED_ROUTES.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    // Check verification status
    const verificationCheck = await fetch(`${request.nextUrl.origin}/api/auth/check-verification`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    const data = await verificationCheck.json();

    if (!verificationCheck.ok || !data.isVerified) {
      // Redirect to verification page with return URL
      const returnUrl = encodeURIComponent(request.nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/verify-email?returnUrl=${returnUrl}&email=${encodeURIComponent(data.email || '')}`, request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/login", "/register"],
};
