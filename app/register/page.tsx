"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import EmailInput from "@/components/EmailInput";
import PasswordInput from "@/components/PasswordInput";
import Input from "@/components/Input";
import Checkbox from "@/components/Checkbox";
import { useForm } from "@/hooks/useForm";
import { validateEmail, validatePassword, validateName } from "@/utils/validation";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  terms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false,
  });

  const {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
  } = useForm<RegisterForm>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
    validationRules: {
      name: validateName,
      email: validateEmail,
      password: (value) => validatePassword(value).errors[0] || "",
      terms: (value) => !value ? "You must accept the terms and conditions" : "",
    },
    onSubmit: async (values) => {
      try {
        setServerError(""); // Clear any previous errors
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          router.push(data.redirectUrl || "/onboarding");
        } else {
          throw new Error(data.error || "Registration failed");
        }
      } catch (error: any) {
        setServerError(error.message || "An error occurred during registration");
        throw error; // Re-throw to keep form in error state
      }
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    const { isValid, errors } = validatePassword(e.target.value);
    setPasswordValidation({
      hasMinLength: !errors.includes("Password must be at least 8 characters long"),
      hasLetter: !errors.includes("Password must contain at least one letter"),
      hasNumber: !errors.includes("Password must contain at least one number"),
    });
  };

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
                Already have an account?
              </span>
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[min(100%,24rem)] sm:max-w-md space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-xs sm:text-sm text-gray-600 px-4">
              Join FoodSnap to start tracking your nutrition journey
            </p>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-3 sm:space-y-4">
              <Input
                id="name"
                name="name"
                label="Full name"
                value={values.name}
                error={errors.name}
                autoComplete="name"
                required
                onChange={handleChange}
              />

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
                autoComplete="new-password"
                showValidation
                validation={passwordValidation}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <Checkbox
              id="terms"
              name="terms"
              checked={values.terms}
              onChange={handleChange}
              error={errors.terms}
              label={
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </span>
              }
            />

            <Button
              type="submit"
              isLoading={loading}
              loadingText="Creating account..."
              className="w-full"
            >
              Create account
            </Button>

            <div className="text-center sm:hidden">
              <span className="text-xs text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Sign in
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
