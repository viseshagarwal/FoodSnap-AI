"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

// Separate component for verification logic that uses useSearchParams
function VerificationComponent() {
  const [status, setStatus] = useState<'loading' | 'verified' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const emailParam = searchParams.get('email');
      const registered = searchParams.get('registered');
      
      if (emailParam) {
        setEmail(emailParam);
      }

      // Just registered flow
      if (registered === 'true' && emailParam) {
        setStatus('loading');
        setMessage(`We've sent a verification link to ${emailParam}. Please check your email (including spam folder) to verify your account and continue.`);
        return;
      }

      // No token flow
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided. Please check your email for the verification link or request a new one.');
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('verified');
          setMessage('Email verified successfully! You will be redirected to login...');
          // Redirect to login after a short delay with success message
          setTimeout(() => {
            router.push('/login?verified=true');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to verify email. The link may have expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification. Please try again or request a new verification link.');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="w-full max-w-[min(100%,24rem)] sm:max-w-md space-y-6 sm:space-y-8 text-center">
      {status === 'loading' && (
        <>
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Verification Status</h3>
                <div className="mt-2 text-sm text-blue-700">{message}</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
              try signing in
            </Link>{' '}
            to request a new verification link.
          </p>
        </>
      )}

      {status === 'verified' && (
        <div className="rounded-lg bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success!</h3>
              <div className="mt-2 text-sm text-green-700">{message}</div>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Verification Failed</h3>
              <div className="mt-2 text-sm text-red-700">{message}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Suspense fallback={
          <div className="w-full max-w-[min(100%,24rem)] sm:max-w-md text-center">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Loading</h3>
                  <div className="mt-2 text-sm text-blue-700">Please wait while we verify your email...</div>
                </div>
              </div>
            </div>
          </div>
        }>
          <VerificationComponent />
        </Suspense>
      </div>
    </div>
  );
}