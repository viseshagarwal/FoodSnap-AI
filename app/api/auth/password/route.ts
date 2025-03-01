import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { validatePassword } from "@/utils/validation";
import { hash, compare } from "bcryptjs";

export async function PUT(request: Request) {
  try {
    // Get the JWT token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      console.log("Unauthorized: No JWT token found in cookies");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    
    const userId = decoded.userId;
    
    // Parse the request body
    const data = await request.json();
    const { currentPassword, newPassword, confirmPassword } = data;
    
    // Validate required fields
    if (!currentPassword) {
      return NextResponse.json({ message: "Current password is required" }, { status: 400 });
    }
    
    if (!newPassword) {
      return NextResponse.json({ message: "New password is required" }, { status: 400 });
    }
    
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }
    
    // Validate password requirements
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { message: passwordValidation.errors[0] },
        { status: 400 }
      );
    }
    
    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, hashedPassword: true }
    });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // Verify current password
    const isPasswordValid = await compare(currentPassword, user.hashedPassword || "");
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }
    
    // Hash new password
    const hashedPassword = await hash(newPassword, 10);
    
    // Update user password
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword: hashedPassword,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        //image: true
      }
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { 
        error: "Failed to update password", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}