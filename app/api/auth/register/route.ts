import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    console.log("Received registration request:", { name, email });

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Attempting to create user...");
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });
    console.log("User created successfully:", user.id);

    // Create JWT token for the new user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // Set the cookie with the token
    const response = NextResponse.json({
      success: true,
      redirectUrl: "/onboarding"
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400 // 1 day
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
