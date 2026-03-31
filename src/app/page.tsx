'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Shield, Zap, Link2, Check, ArrowRight, Crown } from 'lucide-react';

export default function HomePage() {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(160deg, #FDF5EC 0%, #F7F7EF 45%, #EEF7FA 100%)',
      }}
    >
      {/* Header */}
      <header className="border-b border-accent/15" style={{ backgroundColor: 'rgba(247,247,239,0.92)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/leynk-logo.svg" 
              alt="Leynk" 
              width={180} 
              height={49}
              priority
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-text-primary hover:text-accent font-medium hidden sm:block transition-colors">Pricing</Link>
            <Link href="/login" className="text-text-primary hover:text-accent font-medium transition-colors">Login</Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-accent text-white rounded-full font-semibold hover:bg-accent/90 transition-all hover:shadow-lg"
            >
              Start For Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 shadow-sm">
            <Sparkles className="text-accent" size={20} />
            <span className="text-sm font-medium text-text-primary">
              All your links. One place.
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
            Everything you share,
            <br />
            <span className="text-accent">in a single link.</span>
          </h2>
          
          <p className="text-xl text-text-primary/70 max-w-2xl mx-auto mb-8">
            Build a stunning personal page that brings together your social profiles,
            projects, store and content. Share once and let people find everything.
          </p>
          
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-accent text-white rounded-full font-semibold text-lg hover:bg-accent/90 transition-all hover:shadow-xl hover:scale-105"
          >
            Start For Free
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Zap className="text-accent" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              Up in Minutes
            </h3>
            <p className="text-text-primary/70">
              No design skills needed. Set up your page, add your links and go live in minutes.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="text-accent" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              Built to Last
            </h3>
            <p className="text-text-primary/70">
              Your page stays fast and online. Backed by infrastructure built for reliability.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Link2 className="text-accent" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              No Limits
            </h3>
            <p className="text-text-primary/70">
              Add as many links as you need. Your whole online presence, organized in one place.
            </p>
          </div>
        </div>

        {/* Accent Color Showcase */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-text-primary mb-3">
              Made for{' '}
              <span style={{ color: '#58A9BE' }}>peo</span><span style={{ color: '#D75852' }}>ple</span>{' '}
              <span style={{ color: '#F3C845' }}>like you.</span>
            </h3>
            <p className="text-text-primary/60 text-lg max-w-xl mx-auto">
              Three things that make every Leynk page worth sharing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Teal — Connect */}
            <div
              className="relative rounded-3xl p-8 overflow-hidden cursor-default transition-transform duration-300 hover:-translate-y-2"
              style={{ backgroundColor: '#58A9BE' }}
            >
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/20" />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/10" />
              <p className="text-white/30 font-black text-7xl leading-none mb-4 select-none">01</p>
              <h4 className="text-2xl font-bold text-white mb-2">One Link</h4>
              <p className="text-white/75 leading-relaxed">
                Bring your whole world into a single URL. Social, portfolio, store, newsletter and more.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-white/70 text-sm font-semibold">
                <span className="w-6 h-0.5 bg-white/50 inline-block" />
                leynk.co/you
              </div>
            </div>

            {/* Coral — Stand Out */}
            <div
              className="relative rounded-3xl p-8 overflow-hidden cursor-default transition-transform duration-300 hover:-translate-y-2 md:mt-6"
              style={{ backgroundColor: '#D75852' }}
            >
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/20" />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/10" />
              <p className="text-white/30 font-black text-7xl leading-none mb-4 select-none">02</p>
              <h4 className="text-2xl font-bold text-white mb-2">Your Style</h4>
              <p className="text-white/75 leading-relaxed">
                Pick a look that feels like you. From clean and minimal to bold and expressive.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-white/70 text-sm font-semibold">
                <span className="w-6 h-0.5 bg-white/50 inline-block" />
                5 curated themes
              </div>
            </div>

            {/* Gold — Shine */}
            <div
              className="relative rounded-3xl p-8 overflow-hidden cursor-default transition-transform duration-300 hover:-translate-y-2"
              style={{ backgroundColor: '#F3C845' }}
            >
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#2C3A42]/15" />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-[#2C3A42]/10" />
              <p className="text-[#2C3A42]/20 font-black text-7xl leading-none mb-4 select-none">03</p>
              <h4 className="text-2xl font-bold text-[#2C3A42] mb-2">Know Your Reach</h4>
              <p className="text-[#2C3A42]/65 leading-relaxed">
                See who visits, where they come from and which links they click. All in real time.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-[#2C3A42]/55 text-sm font-semibold">
                <span className="w-6 h-0.5 bg-[#2C3A42]/35 inline-block" />
                Live analytics
              </div>
            </div>
          </div>
        </div>

        {/* Example Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-text-primary mb-4">
            See it for yourself
          </h3>
          <p className="text-text-primary/70 mb-8">
            Every Leynk page looks great on any screen, no extra work needed.
          </p>
          
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-xl relative">
              <Image src="/taylor.jpg" alt="Taylor Swift" fill className="object-cover" />
            </div>
            <h4 className="text-2xl font-bold text-text-primary mb-2">Taylor Swift</h4>
            <p className="text-text-primary/70 mb-6">Singer, songwriter and director.</p>
            
              <div className="space-y-3">
                <a href="https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-bg-primary text-text-primary rounded-xl p-4 font-semibold hover:bg-white hover:shadow-md border border-transparent hover:border-accent/20 transition-all cursor-pointer group">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent group-hover:scale-110 transition-transform">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.784-.963-.335.077-.67-.133-.746-.47-.077-.334.132-.67.47-.745 3.806-.874 7.076-.496 9.71 1.115.293.18.386.563.207.856zm1.226-2.738c-.227.368-.7.485-1.066.26-2.695-1.656-6.804-2.146-9.965-1.176-.41.125-.837-.105-.96-.514-.125-.41.104-.837.513-.96 3.63-1.114 8.163-.564 11.217 1.314.367.226.485.7.26 1.067zm.098-2.85c-3.23-1.92-8.542-2.096-11.603-1.16-.5.15-1.02-.132-1.17-.63-.15-.5.13-1.02.63-1.17 3.52-1.075 9.4-1.25 13.14 1.114.453.284.593.89.31 1.343-.284.453-.89.593-1.343.31z"/>
                  </svg>
                  Listen on Spotify
                </a>

                <a href="https://music.apple.com/us/music-video/opalite/1874387735" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-bg-primary text-text-primary rounded-xl p-4 font-semibold hover:bg-white hover:shadow-md border border-transparent hover:border-accent/20 transition-all cursor-pointer group">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent group-hover:scale-110 transition-transform">
                    <path d="M16.597 12.392c0-3.155 2.571-4.66 2.686-4.733-1.465-2.144-3.738-2.435-4.545-2.478-1.928-.194-3.778 1.134-4.764 1.134-1.006 0-2.527-1.11-4.113-1.08-2.071.026-3.987 1.205-5.051 3.064-2.15 3.738-.548 9.28 1.547 12.311 1.027 1.482 2.22 3.12 3.811 3.064 1.528-.052 2.108-.98 3.94-.98 1.833 0 2.356.98 3.961.954 1.62-.026 2.651-1.487 3.65-2.951 1.156-1.688 1.631-3.324 1.652-3.411-.035-.015-3.089-1.185-3.089-4.744M14.659 5.253c.84-1.018 1.405-2.433 1.252-3.844-1.218.049-2.705.812-3.568 1.838-.773.916-1.449 2.359-1.275 3.754 1.365.105 2.748-.727 3.591-1.748z"/>
                  </svg>
                  Watch on Apple Music
                </a>

                <a href="https://www.youtube.com/channel/UCqECaJ8Gagnn7YCbPEzWH6g" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-bg-primary text-text-primary rounded-xl p-4 font-semibold hover:bg-white hover:shadow-md border border-transparent hover:border-accent/20 transition-all cursor-pointer group">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent group-hover:scale-110 transition-transform">
                    <path d="M21.582 6.186a2.709 2.709 0 00-1.904-1.914C17.994 3.75 12 3.75 12 3.75s-5.994 0-7.678.522a2.706 2.706 0 00-1.904 1.914C1.896 7.893 1.896 12 1.896 12s0 4.107.522 5.814a2.706 2.706 0 001.904 1.914C5.994 20.25 12 20.25 12 20.25s5.994 0 7.678-.522a2.707 2.707 0 001.904-1.914C22.104 16.107 22.104 12 22.104 12s0-4.107-.522-5.814zM9.993 15.381V8.62L15.385 12l-5.392 3.381z"/>
                  </svg>
                  Subscribe on YouTube
                </a>

                <a href="https://www.tiktok.com/@taylorswift" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-bg-primary text-text-primary rounded-xl p-4 font-semibold hover:bg-white hover:shadow-md border border-transparent hover:border-accent/20 transition-all cursor-pointer group">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent group-hover:scale-110 transition-transform">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 19.34a6.34 6.34 0 006.12-6V6a8.28 8.28 0 005.89 2.6V5.2a4.44 4.44 0 011.78-.35v1.84z"/>
                  </svg>
                  Follow on TikTok
                </a>

                <a href="https://taylorswift.tumblr.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-bg-primary text-text-primary rounded-xl p-4 font-semibold hover:bg-white hover:shadow-md border border-transparent hover:border-accent/20 transition-all cursor-pointer group">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent group-hover:scale-110 transition-transform">
                    <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.364-4.323 1.406" />
                  </svg>
                  Follow on Tumblr
                </a>

                <a href="https://x.com/taylorswift13" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-bg-primary text-text-primary rounded-xl p-4 font-semibold hover:bg-white hover:shadow-md border border-transparent hover:border-accent/20 transition-all cursor-pointer group">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-accent group-hover:scale-110 transition-transform">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Follow on X
                </a>
              </div>
          </div>
        </div>
      </main>

      {/* ── Pricing Sneak Peek ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-4 mt-10">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-semibold" style={{ background: 'rgba(88,169,190,0.1)', color: '#58A9BE' }}>
            <Sparkles size={15} />
            Simple pricing
          </div>
          <h3 className="text-4xl font-bold text-text-primary mb-3">
            Free to start.<br />
            <span className="text-accent">Pay when you're ready.</span>
          </h3>
          <p className="text-text-primary/60 text-lg max-w-xl mx-auto">
            No credit card needed. No hidden fees. 0% transaction fees on every plan.
          </p>
        </div>

        {/* Cards + fade overflow wrapper */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* ── Free ── */}
            <div className="bg-white rounded-3xl p-7 border flex flex-col gap-5 transition-transform duration-300 hover:-translate-y-1" style={{ borderColor: 'rgba(44,58,66,0.1)', boxShadow: '0 4px 20px rgba(44,58,66,0.06)' }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-text-primary/40 mb-3">Free</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-text-primary leading-none">Free</span>
                </div>
                <p className="text-sm text-text-primary/50 font-medium">forever</p>
              </div>
              <ul className="space-y-2.5 flex-1">
                {['Unlimited Links', 'Basic Analytics', 'QR Code', 'Leynk subdomain'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-text-primary/75">
                    <div className="rounded-full p-0.5 shrink-0" style={{ background: 'rgba(88,169,190,0.12)' }}>
                      <Check size={12} strokeWidth={3} color="#58A9BE" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-3 rounded-xl text-sm font-bold text-center transition-all border-2 hover:bg-accent/5" style={{ borderColor: 'rgba(44,58,66,0.15)', color: '#2C3A42' }}>
                Start For Free
              </Link>
            </div>

            {/* ── Creator (highlighted) ── */}
            <div className="rounded-3xl p-7 flex flex-col gap-5 relative transition-transform duration-300 hover:-translate-y-1" style={{ background: '#D75852', boxShadow: '0 20px 50px rgba(215,88,82,0.28)' }}>
              {/* Most popular badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow" style={{ background: '#F3C845', color: '#2C3A42' }}>
                Most Popular
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Crown size={16} color="rgba(255,255,255,0.7)" />
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">Creator</p>
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-sm font-medium text-white/60 self-start mt-2">$</span>
                  <span className="text-4xl font-extrabold text-white leading-none">24.99</span>
                </div>
                <p className="text-sm text-white/55 font-medium">one-time — no subscription</p>
              </div>
              <ul className="space-y-2.5 flex-1">
                {['Remove Leynk Branding', 'Custom Colors & Fonts', 'Built-in Shop', 'Newsletter & Leads', 'Free .bio domain (1yr)'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/85">
                    <div className="rounded-full p-0.5 shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                      <Check size={12} strokeWidth={3} color="#fff" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="w-full py-3 rounded-xl text-sm font-bold text-center transition-all" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                Get Creator
              </Link>
            </div>

            {/* ── Pro ── */}
            <div className="rounded-3xl p-7 flex flex-col gap-5 transition-transform duration-300 hover:-translate-y-1" style={{ background: '#2C3A42', boxShadow: '0 20px 50px rgba(44,58,66,0.2)' }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/35 mb-3">Pro</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-sm font-medium text-white/50 self-start mt-2">$</span>
                  <span className="text-4xl font-extrabold text-white leading-none">9.99</span>
                </div>
                <p className="text-sm text-white/40 font-medium">/month</p>
              </div>
              <ul className="space-y-2.5 flex-1">
                {['Everything in Creator', 'Custom Domain', 'Booking Calendar', 'Verification Badge', 'Team Members'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/75">
                    <div className="rounded-full p-0.5 shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }}>
                      <Check size={12} strokeWidth={3} color="rgba(255,255,255,0.8)" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="w-full py-3 rounded-xl text-sm font-bold text-center transition-all" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                Get Pro
              </Link>
            </div>

          </div>

          {/* Gradient fade + "See all plans" CTA */}
          <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none rounded-b-3xl" style={{ background: 'linear-gradient(to top, rgba(245,241,233,0.95) 0%, transparent 100%)' }} />
        </div>

        {/* Full pricing CTA */}
        <div className="text-center mt-6 relative z-10">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:shadow-lg hover:scale-105 group"
            style={{ background: '#58A9BE', color: '#fff', boxShadow: '0 4px 16px rgba(88,169,190,0.35)' }}
          >
            See full pricing & compare plans
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-text-primary/40 text-xs mt-3 font-medium">Free forever · 0% fees · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}

      <footer className="mt-24 border-t border-accent/15 bg-white/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-block mb-6">
                <Image 
                  src="/leynk-logo.svg" 
                  alt="Leynk" 
                  width={140} 
                  height={38}
                  className="hover:opacity-80 transition-opacity"
                />
              </Link>
              <p className="text-text-primary/70 text-sm leading-relaxed mb-6">
                The only link you'll ever need. Connect your audiences to all of your content with just one clean, beautiful page.
              </p>
            </div>
            
            {/* Links Column 1 */}
            <div>
              <h4 className="font-bold text-text-primary mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-text-primary/70">
                <li><Link href="/" className="hover:text-accent font-medium transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-accent font-medium transition-colors">Pricing</Link></li>
                <li><Link href="/" className="hover:text-accent font-medium transition-colors">Integrations</Link></li>
                <li><Link href="/" className="hover:text-accent font-medium transition-colors">Analytics</Link></li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div>
              <h4 className="font-bold text-text-primary mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-text-primary/70">
                <li><Link href="/" className="hover:text-accent font-medium transition-colors">About Us</Link></li>
                <li><Link href="/" className="hover:text-accent font-medium transition-colors">Careers</Link></li>
                <li><Link href="/" className="hover:text-accent font-medium transition-colors">Blog</Link></li>
                <li><Link href="/" className="hover:text-accent font-medium transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Links Column 3 */}
            <div>
              <h4 className="font-bold text-text-primary mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-text-primary/70">
                <li><Link href="/" className="hover:text-accent font-medium transition-colors">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-accent font-medium transition-colors">Terms of Service</Link></li>
                <li><Link href="/" className="hover:text-accent font-medium transition-colors">Cookie Policy</Link></li>
                <li><Link href="/admin/login" className="hover:text-accent font-medium transition-colors">Admin Login</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-accent/15 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-primary/60 text-sm font-medium">
              © {new Date().getFullYear()} Leynk.co. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 19.34a6.34 6.34 0 006.12-6V6a8.28 8.28 0 005.89 2.6V5.2a4.44 4.44 0 011.78-.35v1.84z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

