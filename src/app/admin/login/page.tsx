'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { validateCredentials, setSession, isAuthenticated } from '@/lib/auth';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const account = validateCredentials(email, password);
    if (account) {
      setSession(account.name, account.role);
      router.push('/admin');
    } else {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/leynk-logo.svg"
              alt="Leynk"
              width={200}
              height={55}
              priority
            />
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
              <Lock className="text-accent" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Login</h1>
            <p className="text-text-primary/60">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-text-primary/40" size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary placeholder:text-text-primary/40"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-text-primary/40" size={20} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full pl-12 pr-12 py-3.5 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary placeholder:text-text-primary/40"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="text-text-primary/40 hover:text-text-primary transition-colors" size={20} />
                  ) : (
                    <Eye className="text-text-primary/40 hover:text-text-primary transition-colors" size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-3.5 rounded-xl font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-accent/10 text-center">
            <Link
              href="/"
              className="text-sm text-text-primary/60 hover:text-accent transition-colors inline-flex items-center gap-1"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-primary/50">
            🔒 Your session is secure and will remain active for 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}

