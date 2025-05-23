import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    // Try NextAuth session first
    const session = await getServerSession(authOptions);
    let userEmail: string | undefined;
    
    if (session?.user?.email) {
      userEmail = session.user.email;
    } else {
      // Try JWT token from cookies as fallback
      const cookieStore = cookies();
      const token = cookieStore.get("token")?.value;
      
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { email: true }
          });
          
          if (user) {
            userEmail = user.email;
          }
        } catch (e) {
          console.error("Token verification error:", e);
        }
      }
    }

    if (!userEmail) {
      return NextResponse.json(
        { isVerified: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user's verification status
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { isVerified: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      isVerified: !!user.emailVerified,
      email: user.email,
    });

  } catch (error) {
    console.error("Check verification error:", error);
    return NextResponse.json(
      { isVerified: false, error: "Failed to check verification status" },
      { status: 500 }
    );
  }
}