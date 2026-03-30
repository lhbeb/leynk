'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isSuperAdmin } from '@/lib/auth';
import { ShieldOff } from 'lucide-react';

/**
 * SuperAdminGuard
 * - Unauthenticated users → redirected to /admin/login
 * - Authenticated but NOT superadmin → shown an "Access Denied" screen (no redirect,
 *   so they know the page exists but they can't use it)
 * - Superadmin → children rendered normally
 */
export default function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'denied' | 'ok'>('loading');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    if (!isSuperAdmin()) {
      setStatus('denied');
      return;
    }
    setStatus('ok');
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-text-primary/60">Loading…</p>
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShieldOff className="text-red-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h1>
          <p className="text-text-primary/60 mb-6">
            This section is restricted to super admins only. Your current account does not have
            permission to access it.
          </p>
          <a
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
