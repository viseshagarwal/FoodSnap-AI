import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { validateEmail } from "@/utils/validation";
import crypto from "crypto";
import { createTransport } from "nodemailer";

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
        emailVerified: true,
        verificationToken: true,
        verificationTokenExpiry: true,
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

    // Check if email is verified
    if (!user.emailVerified) {
      // Check if verification token is still valid
      const tokenValid = user.verificationToken && user.verificationTokenExpiry && 
        new Date(user.verificationTokenExpiry) > new Date();

      if (!tokenValid) {
        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await prisma.user.update({
          where: { id: user.id },
          data: {
            verificationToken,
            verificationTokenExpiry
          }
        });

        // Send new verification email if SMTP is configured
        if (isSmtpConfigured && transporter) {
          const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verificationToken}`;

          try {
            await transporter.sendMail({
              from: process.env.SMTP_FROM,
              to: user.email,
              subject: "Verify your email address",
              html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                  <h1 style="color: #333; text-align: center;">Welcome to FoodSnap AI!</h1>
                  <p style="color: #666; line-height: 1.6;">A new verification link has been generated for your account. Please verify your email address by clicking the button below:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="background-color: #14b8a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
                  </div>
                  <p style="color: #666; line-height: 1.6;">This link will expire in 24 hours.</p>
                  <p style="color: #666; line-height: 1.6;">If you didn't request this verification link, you can safely ignore this email.</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                  <p style="color: #999; font-size: 12px; text-align: center;">This email was sent from FoodSnap AI. Please do not reply to this email.</p>
                </div>
              `,
            });

            return NextResponse.json({
              success: false,
              error: "Please verify your email address to login",
              requiresVerification: true,
              userEmail: user.email,
              message: "A new verification email has been sent to your address"
            }, { status: 403 });
          } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // If email fails, revert the token update
            await prisma.user.update({
              where: { id: user.id },
              data: {
                verificationToken: user.verificationToken,
                verificationTokenExpiry: user.verificationTokenExpiry
              }
            });
            return NextResponse.json({
              success: false,
              error: "Failed to send verification email. Please try again."
            }, { status: 500 });
          }
        }

        // Return standard response if SMTP is not configured
        return NextResponse.json({
          success: false,
          error: "Please verify your email address to login",
          requiresVerification: true,
          userEmail: user.email,
          message: "A new verification email has been sent to your address"
        }, { status: 403 });
      }

      return NextResponse.json({
        success: false,
        error: "Please verify your email address to login",
        requiresVerification: true,
        userEmail: user.email
      }, { status: 403 });
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

    const { hashedPassword: _, verificationToken: __, verificationTokenExpiry: ___, ...userWithoutSensitive } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutSensitive,
      message: "Logged in successfully"
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ 
      success: false,
      error: "An error occurred during login. Please try again." 
    }, { status: 500 });
  }
}
