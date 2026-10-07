'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check if already authenticated
  useEffect(() => {
    async function checkExistingAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (data.authenticated) {
          router.push('/admin/products');
        }
      } catch {
        // Ignore and allow user to log in
      }
    }
    checkExistingAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!password.trim()) {
      setErrorMessage('Please enter the administrator password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim() || undefined,
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setErrorMessage(data.error || 'Invalid credentials. Please verify your password.');
        setIsLoading(false);
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3F1] flex flex-col justify-center items-center p-4 sm:p-6 text-[#4F4140] font-sans relative overflow-hidden">
      {/* Decorative background glow */}
      <div
        className="absolute right-0 top-1/4 -translate-y-1/2 opacity-20 pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-96 h-96 bg-gradient-to-br from-[#BD4935] via-[#D0B7B2] to-[#9A684D] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="w-16 h-16 rounded-full bg-[#BD4935] text-white flex items-center justify-center font-bold text-2xl shadow-md mx-auto mb-4 hover:scale-105 transition-transform"
            title="Return to Bextery Bites storefront"
          >
            BB
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#4F4140]">
            Bextery Bites Admin
          </h1>
          <p className="text-xs sm:text-sm text-[#9A684D] mt-1.5 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Authorized Store Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D0B7B2]/40 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#4F4140] mb-1.5">
                Admin Email / Account (Optional)
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bexterybites.com.ng"
                autoComplete="username"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-[#D0B7B2]/60 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#BD4935]/30 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4F4140] mb-1.5 flex justify-between">
                <span>Admin Password</span>
                <span className="text-[11px] text-[#9A684D] font-normal">Protected</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  autoComplete="current-password"
                  required
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 pr-10 border border-[#D0B7B2]/60 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#BD4935]/30 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#BD4935] hover:bg-[#a63e2c] disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-[11px] text-[#9A684D] leading-relaxed">
              Default administrator access key is configured for verified team operators.
            </p>
            <div className="mt-3">
              <Link
                href="/"
                className="text-xs text-[#BD4935] hover:underline font-semibold"
              >
                &larr; Return to Bextery Bites Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
