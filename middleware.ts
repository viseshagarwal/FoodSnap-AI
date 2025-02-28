import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Simple rate limiting map
const rateLimit = new Map();

export async function middleware(request: NextRequest) {
  // Check for NextAuth.js session
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Check for JWT token
  const jwtToken = request.cookies.get("token")?.value;

  // Protect dashboard and API routes
  if (request.nextUrl.pathname.startsWith("/dashboard") || 
      request.nextUrl.pathname.startsWith("/api/meals")) {
    if (!session && !jwtToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect authenticated users from login/register to dashboard
  if (
    (session || jwtToken) &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Get IP for rate limiting
  const ip = request.ip ?? request.headers.get("x-real-ip");
  
  // Rate limiting
  if (ip) {
    const now = Date.now();
    const requestCount = rateLimit.get(ip) || { count: 0, timestamp: now };

    // Reset count after 1 minute
    if (now - requestCount.timestamp > 60000) {
      requestCount.count = 0;
      requestCount.timestamp = now;
    }

    if (requestCount.count > 60) { // 60 requests per minute
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    requestCount.count++;
    rateLimit.set(ip, requestCount);
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/login", "/register"],
};
