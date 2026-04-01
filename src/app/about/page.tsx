import Link from 'next/link';
import Image from 'next/image';
import { Heart, Globe, Shield, Users, Leaf, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "Built for Creators, by Creators",
      description: "We are an independent, diverse team building tools for people like us. No corporate greed, just a passionate team creating software that empowers independent creators and businesses globally.",
      color: "#58A9BE"
    },
    {
      icon: Shield,
      title: "Your Data is Yours",
      description: "We believe in privacy by default. We never sell your data, we don't track your visitors across the web, and we give you full export access to everything you build on Leynk.",
      color: "#D75852"
    },
    {
      icon: Globe,
      title: "Global First",
      description: "We are proud to support 33+ localized payment methods worldwide so you can reach your audience, no matter where they are. 0% transaction fees means you keep every dollar you earn.",
      color: "#F3C845"
    },
    {
      icon: Leaf,
      title: "Work-Life Harmony",
      description: "We are a human-centric company. We pioneer policies like menstrual leave, unlimited PTO, and remote-first culture because we believe the best products are built by healthy, happy teams.",
      color: "#6DB28B" // Soft green
    }
  ];

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(160deg, #FDF5EC 0%, #F7F7EF 45%, #EEF7FA 100%)',
      }}
    >
      {/* Header */}
      <header className="border-b border-accent/15 sticky top-0 z-50" style={{ backgroundColor: 'rgba(247,247,239,0.92)', backdropFilter: 'blur(12px)' }}>
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

      <main className="flex-1 max-w-6xl mx-auto px-4 py-20 w-full">
        {/* Hero Section */}
        <div className="text-center mb-24 relative">

          <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6 leading-tight">
            We are building the <span className="text-accent underline decoration-wavy decoration-accent/30 underline-offset-8">link</span><br />
            between you and the world.
          </h1>
          
          <p className="text-xl text-text-primary/70 max-w-2xl mx-auto">
            Leynk was born from a simple idea: your story deserves more than just a link. It deserves a home, an audience, and a way to grow—without boundaries or corporate gatekeepers.
          </p>
        </div>

        {/* Our Story / Mission */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-10 md:p-14 border border-accent/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-2/5 rounded-full blur-2xl -ml-10 -mb-10"></div>
            
            <h2 className="text-3xl font-bold text-text-primary mb-6 relative z-10">Our Mission</h2>
            <div className="space-y-4 text-text-primary/75 leading-relaxed text-lg relative z-10">
              <p>
                The internet was meant to be a place of infinite connection, yet it has become increasingly fragmented. Social algorithms hide your content, platforms nickel-and-dime your sales, and connecting your tools requires an engineering degree.
              </p>
              <p>
                <strong>We decided to fix that.</strong>
              </p>
              <p>
                Leynk isn't just a link-in-bio tool; it's a launchpad. We give creators, activists, and independent businesses a unified space to showcase their work, sell products with <span className="text-accent font-semibold">0% transaction fees</span>, and completely own their audience relationship.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-accent rounded-3xl p-8 aspect-square flex flex-col justify-end text-white shadow-lg overflow-hidden relative group">
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0"></div>
                <div className="relative z-10">
                  <span className="text-5xl font-black mb-2 block">1M+</span>
                  <span className="font-semibold text-white/90">Pages Created</span>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-8 aspect-square flex flex-col justify-end text-text-primary shadow-sm border border-accent/10">
                <span className="text-5xl font-black mb-2 text-accent-2 block">0%</span>
                <span className="font-semibold text-text-primary/70">Transaction Fees</span>
              </div>
            </div>
            
            <div className="space-y-6 pt-12">
              <div className="bg-white rounded-3xl p-8 aspect-square flex flex-col justify-end text-text-primary shadow-sm border border-accent/10">
                <span className="text-5xl font-black mb-2 text-accent-3 block">75%</span>
                <span className="font-semibold text-text-primary/70">Diverse Team</span>
              </div>
              <div className="bg-text-primary rounded-3xl p-8 aspect-square flex flex-col justify-end text-white shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/5 transition-opacity group-hover:opacity-0"></div>
                <div className="relative z-10">
                  <span className="text-5xl font-black mb-2 block">33+</span>
                  <span className="font-semibold text-white/90">Global Payment Methods</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CEO Quote */}
        <div className="mb-32">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-10 md:p-14 border border-accent/10 shadow-lg text-center relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute top-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -ml-10 -mt-10"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-2/10 rounded-full blur-2xl -mr-10 -mb-10"></div>
            
            <div className="relative z-10">
              <svg className="w-12 h-12 text-accent/30 mx-auto mb-6" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-2.2 1.8-4 4-4V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z"></path>
              </svg>
              <blockquote className="text-2xl md:text-3xl font-medium text-text-primary leading-tight mb-8">
                "We built Leynk because we believe every creator and business deserves a platform that actually works for them. No corporate greed, no hidden fees. Just powerful tools to help you grow. If you have any feedback or ideas, my inbox is always open."
              </blockquote>
              <div className="font-bold text-text-primary mb-1">M. El Mahboubi</div>
              <div className="text-text-primary/60 text-sm mb-4">Founder & CEO</div>
              <a href="mailto:elmahboubi@leynk.co" className="inline-block px-6 py-2 bg-accent/10 text-accent font-semibold rounded-full hover:bg-accent hover:text-white transition-colors">
                elmahboubi@leynk.co
              </a>
            </div>
          </div>
        </div>

        {/* Our Cores / Values */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">What We Stand For</h2>
            <p className="text-lg text-text-primary/60 max-w-2xl mx-auto">
              Our core values aren't just words on a wall; they dictate every product decision, feature launch, and hiring choice we make.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl p-8 border border-transparent hover:border-accent/20 hover:shadow-xl transition-all duration-300 group"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: `${val.color}15` }}
                >
                  <val.icon size={28} color={val.color} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{val.title}</h3>
                <p className="text-text-primary/65 leading-relaxed text-sm">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-accent rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
          
          <Sparkles className="mx-auto w-10 h-10 mb-6 text-white/80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">Ready to join the movement?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto relative z-10">
            Build your page completely free. Upgrade only when you want to—or grab our one-time lifetime pass and say goodbye to subscriptions entirely.
          </p>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-white text-accent rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Get Started for Free
            </Link>
            <Link 
              href="/pricing" 
              className="px-8 py-4 bg-transparent border-2 border-white/40 text-white rounded-full font-bold hover:bg-white/10 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-accent/15 bg-white/40 backdrop-blur-md">
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
            
            {/* Business Info Column */}
            <div>
              <h4 className="font-bold text-text-primary mb-4">Business Details</h4>
              <ul className="space-y-3 text-sm text-text-primary/70">
                <li className="font-semibold text-text-primary/80">Raveloo Retailers LLC</li>
                <li>EIN: 38-4276758</li>
                <li>5830 E 2nd St, Ste 7000<br/>Casper, WY 82609</li>
                <li>+1 (912) 923-1747</li>
                <li><a href="mailto:elmahboubi@leynk.co" className="hover:text-accent transition-colors">elmahboubi@leynk.co</a></li>
              </ul>
            </div>

            {/* Links Column 1 */}
            <div>
              <h4 className="font-bold text-text-primary mb-4">Explore</h4>
              <ul className="space-y-3 text-sm text-text-primary/70">
                <li><Link href="/" className="hover:text-accent font-medium transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-accent font-medium transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-accent font-medium transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-accent font-medium transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div>
              <h4 className="font-bold text-text-primary mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-text-primary/70">
                <li><Link href="/privacy" className="hover:text-accent font-medium transition-colors">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-accent font-medium transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookie-preferences" className="hover:text-accent font-medium transition-colors">Cookie Policy</Link></li>
                <li><Link href="/admin/login" className="hover:text-accent font-medium transition-colors">Admin Login</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-accent/15 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-primary/60 text-sm font-medium">
              © {new Date().getFullYear()} Raveloo Retailers LLC. All rights reserved.
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
