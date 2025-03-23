import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { Adapter } from "next-auth/adapters";

// Add explicit type assertion for the adapter
const prismaAdapter = PrismaAdapter(prisma) as Adapter;

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    emailVerified?: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      emailVerified?: boolean;
    }
  }
  interface User {
    id: string;
    email: string;
    name?: string | null;
    emailVerified?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: prismaAdapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            hashedPassword: true,
            emailVerified: true
          }
        });

        if (!user) {
          throw new Error("Email or password is incorrect");
        }

        if (!user.hashedPassword) {
          throw new Error("Please use the appropriate login method");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          throw new Error("Email or password is incorrect");
        }

        // Convert emailVerified to boolean explicitly
        const emailVerified = Boolean(user.emailVerified);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // Ensure emailVerified is converted to boolean
        token.emailVerified = Boolean(user.emailVerified);
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        // Ensure emailVerified is a boolean
        session.user.emailVerified = Boolean(token.emailVerified);
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};