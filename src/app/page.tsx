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
              <div className="bg-bg-primary rounded-xl p-4 text-text-primary font-medium hover:shadow-md transition-shadow cursor-pointer">
                My Portfolio
              </div>
              <div className="bg-bg-primary rounded-xl p-4 text-text-primary font-medium hover:shadow-md transition-shadow cursor-pointer">
                Latest Blog Post
              </div>
              <div className="bg-bg-primary rounded-xl p-4 text-text-primary font-medium hover:shadow-md transition-shadow cursor-pointer">
                Shop My Picks
              </div>
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

