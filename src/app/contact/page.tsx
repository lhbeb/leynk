'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';

export default function ContactPage() {
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
            <Link href="/about" className="text-text-primary hover:text-accent font-medium hidden sm:block transition-colors">About Us</Link>
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
        {/* Title Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 shadow-sm border border-accent/10">
            <MessageSquare className="text-accent" size={18} />
            <span className="text-sm font-semibold text-text-primary">
              We're here to help
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">Contact Us</h1>
          <p className="text-xl text-text-primary/70 max-w-2xl mx-auto">
            Have a question, feedback, or need support? Reach out to us using the details below. Our team is always ready to assist you.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto items-start">
          
          {/* Contact Details */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-accent/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <h2 className="text-2xl font-bold text-text-primary mb-6 relative z-10">Company Details</h2>
            
            <div className="space-y-6 relative z-10">
              <div>
                <h3 className="text-sm font-bold text-text-primary/50 uppercase tracking-wider mb-2">Legal Name</h3>
                <p className="text-lg font-semibold text-text-primary">Raveloo Retailers LLC</p>
                <p className="text-sm text-text-primary/70">EIN: 38-4276758</p>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary/50 uppercase tracking-wider mb-1">Address</h3>
                  <p className="text-text-primary">5830 E 2nd St, Ste 7000</p>
                  <p className="text-text-primary">Casper, WY 82609</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D75852]/10 flex items-center justify-center shrink-0">
                  <Phone size={20} color="#D75852" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary/50 uppercase tracking-wider mb-1">Phone</h3>
                  <p className="text-text-primary">+1 (912) 923-1747</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F3C845]/20 flex items-center justify-center shrink-0">
                  <Mail size={20} color="#e5b41c" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary/50 uppercase tracking-wider mb-1">Email</h3>
                  <p className="text-text-primary">support@leynk.co</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Placeholder */}
          <div className="bg-white rounded-3xl p-8 border border-accent/10 shadow-sm">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Send a Message</h2>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! We will get back to you soon."); }}>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Your Name</label>
                <input type="text" placeholder="Jane Doe" className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50 bg-gray-50/50" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Email Address</label>
                <input type="email" placeholder="jane@example.com" className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50 bg-gray-50/50" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Message</label>
                <textarea rows={4} placeholder="How can we help you today?" className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50 bg-gray-50/50 resize-y" required></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
                Send Message
              </button>
            </form>
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
