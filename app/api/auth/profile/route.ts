import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

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
    const { name, email } = data;
    
    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }
    
    if (!email?.trim()) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }
    
    // Get the current user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if email is being changed and if it already exists for another user
    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { message: "Email is already in use" },
          { status: 400 }
        );
      }
    }
    
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name,
        email,
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
    console.error("Profile update error:", error);
    return NextResponse.json(
      { 
        error: "Failed to update profile", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}