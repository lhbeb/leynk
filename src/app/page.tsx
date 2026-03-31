import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Shield, Zap, Link2 } from 'lucide-react';

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
          <Link
            href="/admin"
            className="px-6 py-2.5 bg-accent text-white rounded-full font-semibold hover:bg-accent/90 transition-all hover:shadow-lg"
          >
            Admin Dashboard
          </Link>
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
            href="/admin"
            className="inline-block px-8 py-4 bg-accent text-white rounded-full font-semibold text-lg hover:bg-accent/90 transition-all hover:shadow-xl hover:scale-105"
          >
            Create your Leynk
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
                <a href="https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-[#1DB954] text-white rounded-xl p-4 font-semibold hover:bg-[#1ed760] hover:shadow-lg transition-all cursor-pointer">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.784-.963-.335.077-.67-.133-.746-.47-.077-.334.132-.67.47-.745 3.806-.874 7.076-.496 9.71 1.115.293.18.386.563.207.856zm1.226-2.738c-.227.368-.7.485-1.066.26-2.695-1.656-6.804-2.146-9.965-1.176-.41.125-.837-.105-.96-.514-.125-.41.104-.837.513-.96 3.63-1.114 8.163-.564 11.217 1.314.367.226.485.7.26 1.067zm.098-2.85c-3.23-1.92-8.542-2.096-11.603-1.16-.5.15-1.02-.132-1.17-.63-.15-.5.13-1.02.63-1.17 3.52-1.075 9.4-1.25 13.14 1.114.453.284.593.89.31 1.343-.284.453-.89.593-1.343.31z"/>
                  </svg>
                  Listen on Spotify
                </a>

                <a href="https://www.youtube.com/channel/UCqECaJ8Gagnn7YCbPEzWH6g" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-[#FF0000] text-white rounded-xl p-4 font-semibold hover:bg-[#FF0000]/90 hover:shadow-lg transition-all cursor-pointer">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M21.582 6.186a2.709 2.709 0 00-1.904-1.914C17.994 3.75 12 3.75 12 3.75s-5.994 0-7.678.522a2.706 2.706 0 00-1.904 1.914C1.896 7.893 1.896 12 1.896 12s0 4.107.522 5.814a2.706 2.706 0 001.904 1.914C5.994 20.25 12 20.25 12 20.25s5.994 0 7.678-.522a2.707 2.707 0 001.904-1.914C22.104 16.107 22.104 12 22.104 12s0-4.107-.522-5.814zM9.993 15.381V8.62L15.385 12l-5.392 3.381z"/>
                  </svg>
                  Subscribe on YouTube
                </a>

                <a href="https://www.tiktok.com/@taylorswift" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-[#000000] text-white rounded-xl p-4 font-semibold hover:bg-[#222222] hover:shadow-lg transition-all cursor-pointer">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 19.34a6.34 6.34 0 006.12-6V6a8.28 8.28 0 005.89 2.6V5.2a4.44 4.44 0 011.78-.35v1.84z"/>
                  </svg>
                  Follow on TikTok
                </a>

                <a href="https://taylorswift.tumblr.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-[#36465D] text-white rounded-xl p-4 font-semibold hover:bg-[#2e3b4f] hover:shadow-lg transition-all cursor-pointer">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.364-4.323 1.406" />
                  </svg>
                  Follow on Tumblr
                </a>

                <a href="https://x.com/taylorswift13" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-[#0F1419] text-white rounded-xl p-4 font-semibold hover:bg-[#272c30] hover:shadow-lg transition-all cursor-pointer">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Follow on X
                </a>
              </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-accent/20 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <div className="flex justify-center mb-3">
            <Image 
              src="/leynk-logo.svg" 
              alt="Leynk" 
              width={150} 
              height={41}
              className="opacity-70"
            />
          </div>
          <p className="text-text-primary/60 text-sm">© 2025 Leynk.co. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

