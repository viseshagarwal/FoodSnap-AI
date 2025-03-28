import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { validateEmail, validatePassword, validateName } from "@/utils/validation";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { name, email, password } = requestData;

    // Validate input
    const nameError = validateName(name);
    if (nameError) {
      return NextResponse.json({ 
        success: false,
        error: nameError 
      }, { status: 400 });
    }

    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json({ 
        success: false,
        error: emailError 
      }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: passwordValidation.errors[0]
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: "An account with this email already exists"
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        emailVerified: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      }
    });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return NextResponse.json({
        success: false,
        error: "Server configuration error"
      }, { status: 500 });
    }

    // Generate token for login
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie for authentication
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day
    });

    return NextResponse.json({
      success: true,
      user,
      message: "Registration successful.",
      redirectUrl: "/onboarding"
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to create account"
    }, { status: 500 });
  }
}
