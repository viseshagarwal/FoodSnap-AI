import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { validateEmail } from "@/utils/validation";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate email format
    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json({ 
        success: false,
        error: emailError 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        hashedPassword: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: "Invalid email or password" 
      }, { status: 401 });
    }

    if (!user.hashedPassword) {
      return NextResponse.json({
        success: false,
        error: "Please reset your password to continue"
      }, { status: 400 });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return NextResponse.json({
        success: false,
        error: "Invalid email or password"
      }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day
    });

    return NextResponse.json({
      success: true,
      user,
      message: "Logged in successfully"
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to log in" },
      { status: 500 }
    );
  }
}
