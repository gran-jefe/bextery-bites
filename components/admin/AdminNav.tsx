'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Send,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white border-b border-[#D0B7B2]/40 shadow-xs sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Portal Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="w-10 h-10 rounded-full bg-[#BD4935] text-white flex items-center justify-center font-bold text-lg shadow-sm hover:opacity-90 transition shrink-0"
            title="Bextery Bites Admin"
          >
            BB
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#4F4140] leading-tight">
                Admin Control Portal
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Authenticated
              </span>
            </div>
            <p className="text-xs text-[#9A684D]">
              Bextery Bites Storefront & Marketing Management
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 bg-[#FAF3F1] p-1 rounded-xl border border-[#D0B7B2]/50 text-xs sm:text-sm font-medium">
          <Link
            href="/admin/products"
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              pathname === '/admin/products' || pathname === '/admin'
                ? 'bg-[#BD4935] text-white shadow-xs font-semibold'
                : 'text-[#4F4140] hover:bg-white/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Products Manager
          </Link>
          <Link
            href="/admin/broadcast"
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              pathname === '/admin/broadcast'
                ? 'bg-[#BD4935] text-white shadow-xs font-semibold'
                : 'text-[#4F4140] hover:bg-white/60'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            WhatsApp Hub
          </Link>
        </nav>

        {/* Actions: View Storefront & Logout */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="px-3 py-1.5 text-xs text-[#4F4140] bg-white border border-[#D0B7B2]/60 hover:border-[#BD4935] rounded-xl font-medium transition flex items-center gap-1.5 shadow-2xs"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3 h-3 text-[#9A684D]" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-3 py-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 rounded-xl font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Sign out of Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
