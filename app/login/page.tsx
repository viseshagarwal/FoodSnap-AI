"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import EmailInput from "@/components/EmailInput";
import PasswordInput from "@/components/PasswordInput";
import Checkbox from "@/components/Checkbox";
import { useForm } from "@/hooks/useForm";
import { validateEmail, validatePassword } from "@/utils/validation";

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
  } = useForm<LoginForm>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationRules: {
      email: validateEmail,
      password: (value) => validatePassword(value).error,
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          router.push("/dashboard");
        } else {
          throw new Error(data.error || "Login failed");
        }
      } catch (error: any) {
        throw new Error(error.message || "An error occurred during login");
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden xs:inline">
                New to FoodSnap?
              </span>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[min(100%,24rem)] sm:max-w-md space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-xs sm:text-sm text-gray-600 px-4">
              Sign in to your account to continue
            </p>
          </div>

          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-3 sm:space-y-4">
              <EmailInput
                value={values.email}
                error={errors.email}
                onChange={handleChange}
              />

              <PasswordInput
                id="password"
                label="Password"
                value={values.password}
                error={errors.password}
                autoComplete="current-password"
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                label="Remember me"
                checked={values.rememberMe}
                onChange={handleChange}
              />

              <Link
                href="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              loadingText="Signing in..."
              className="w-full"
            >
              Sign in
            </Button>

            <div className="text-center sm:hidden">
              <span className="text-xs text-gray-600">
                New to FoodSnap?{" "}
                <Link
                  href="/register"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Create an account
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      <Footer className="mt-8 sm:mt-12" />
    </div>
  );
}
