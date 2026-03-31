'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: '#F7F7EF' }}>
      
      {/* Left Side: Branding */}
      <div className="w-full md:w-1/2 p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #58A9BE 0%, #44899c 100%)' }}>
        <Link href="/">
          {/* Using a bright/white filter on the logo if needed, or stick to default */}
          <span className="text-3xl font-bold text-white tracking-widest">LEYNK</span>
        </Link>
        
        <div className="text-white max-w-md mx-auto my-20">
          <Sparkles className="w-12 h-12 mb-6 text-white/80" />
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">Claim your corner of the internet.</h2>
          <p className="text-xl text-white/80">Join thousands of creators, brands, and businesses using Leynk to grow their audience.</p>
        </div>
        
        <div className="text-white/60 text-sm">© 2026 Leynk.co</div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 p-10 flex items-center justify-center bg-[#F7F7EF]">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Create your account</h1>
          <p className="text-text-primary/60 mb-8">Start your free trial today. No credit card required.</p>

          <form onSubmit={(e) => { e.preventDefault(); alert("Fake Signup Successful!"); }} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Leynk Handle</label>
              <div className="flex border border-accent/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent/50 bg-white">
                <span className="px-4 py-3 bg-gray-50 text-text-primary/50 border-r border-accent/20">leynk.co/</span>
                <input type="text" placeholder="username" className="w-full px-4 py-3 focus:outline-none" required />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Email Address</label>
              <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white" required />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Password</label>
              <input type="password" placeholder="Create a strong password" className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white" required />
            </div>
            
            <button type="submit" className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 mt-4">
              Create My Leynk
            </button>
          </form>

          <p className="text-center text-text-primary/60 text-sm mt-8">
            Already have an account? <Link href="/login" className="text-accent font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
