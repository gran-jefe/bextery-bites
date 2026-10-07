'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AdminNav from './AdminNav';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (isMounted) {
          if (data && data.authenticated) {
            setStatus('authenticated');
          } else {
            setStatus('unauthenticated');
            router.push('/admin/login');
          }
        }
      } catch (err) {
        if (isMounted) {
          setStatus('unauthenticated');
          router.push('/admin/login');
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#FAF3F1] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full bg-[#BD4935] text-white flex items-center justify-center font-bold text-xl shadow-md mb-4 animate-pulse">
          BB
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#4F4140]">
          <Loader2 className="w-4 h-4 animate-spin text-[#BD4935]" />
          <span>Verifying administrator access...</span>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF3F1] text-[#4F4140] font-sans">
      <AdminNav />
      {children}
    </div>
  );
}
