import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createTransport } from "nodemailer";
import { validateEmail, validatePassword, validateName } from "@/utils/validation";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Validate SMTP configuration
const isSmtpConfigured = 
  process.env.SMTP_HOST && 
  process.env.SMTP_PORT && 
  process.env.SMTP_USER && 
  process.env.SMTP_PASSWORD && 
  process.env.SMTP_FROM;

// Configure nodemailer conditionally
const transporter = isSmtpConfigured ? createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
}) : null;

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

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

    // Set up verification token if SMTP is configured
    const verificationToken = isSmtpConfigured ? crypto.randomBytes(32).toString("hex") : null;
    const verificationTokenExpiry = verificationToken ? 
      new Date(Date.now() + 24 * 60 * 60 * 1000) : null; // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        emailVerified: !isSmtpConfigured, // Auto-verify if no SMTP
        ...(verificationToken && {
          verificationToken,
          verificationTokenExpiry
        })
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      }
    });

    // If SMTP is configured, send verification email
    if (isSmtpConfigured && transporter && verificationToken) {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verificationToken}`;

      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: user.email,
          subject: "Verify your email address",
          html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
              <h1 style="color: #333; text-align: center;">Welcome to FoodSnap AI!</h1>
              <p style="color: #666; line-height: 1.6;">Thank you for registering. Please verify your email address by clicking the button below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background-color: #14b8a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
              </div>
              <p style="color: #666; line-height: 1.6;">This link will expire in 24 hours.</p>
              <p style="color: #666; line-height: 1.6;">If you didn't create an account, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="color: #999; font-size: 12px; text-align: center;">This email was sent from FoodSnap AI. Please do not reply to this email.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        
        // Delete the user if email fails
        await prisma.user.delete({ where: { id: user.id } });
        
        return NextResponse.json({
          success: false,
          error: "Failed to send verification email. Please try again."
        }, { status: 500 });
      }
    }

    // Generate token for immediate login if email verification is not required
    const token = !isSmtpConfigured ? jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    }) : null;

    // Set cookie if auto-verified
    if (token) {
      cookies().set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400, // 1 day
      });
    }

    return NextResponse.json({
      success: true,
      user,
      requiresVerification: isSmtpConfigured,
      message: isSmtpConfigured 
        ? "Registration successful. Please check your email to verify your account."
        : "Registration successful. You are now logged in.",
      redirectUrl: isSmtpConfigured 
        ? `/verify-email?registered=true&email=${encodeURIComponent(user.email)}` 
        : "/onboarding"
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({
      success: false,
      error: "An error occurred during registration. Please try again."
    }, { status: 500 });
  }
}
