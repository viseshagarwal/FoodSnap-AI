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
  // Skip middleware for auth-related API endpoints
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/login", "/register"],
};
