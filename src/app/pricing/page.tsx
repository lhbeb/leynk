'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Check, Zap, Crown, Star, Building2, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    icon: Star,
    iconColor: '#2C3A42',
    badge: null,
    price: { monthly: 0, annual: 0 },
    period: 'forever',
    description: 'Everything you need to launch your link-in-bio instantly.',
    color: '#2C3A42',
    bgColor: '#F7F7EF',
    borderColor: 'rgba(44,58,66,0.12)',
    features: [
      'Unlimited Links',
      'Basic Analytics (30 days)',
      '3 Page Templates',
      'QR Code Generation',
      'Leynk subdomain (leynk.co/you)',
      'Mobile-optimized page',
    ],
    cta: 'Start For Free',
    ctaHref: '/signup',
    popular: false,
  },
  {
    id: 'mini',
    name: 'Mini',
    icon: Zap,
    iconColor: '#58A9BE',
    badge: null,
    price: { monthly: 4.99, annual: 3.99 },
    period: 'month',
    description: 'Level up with scheduling, pixels, and advanced analytics.',
    color: '#58A9BE',
    bgColor: '#EFF8FB',
    borderColor: 'rgba(88,169,190,0.25)',
    features: [
      'Everything in Free',
      'Scheduled Links',
      'Link Groups & Folders',
      'Password-protected Links',
      'External Tracking Pixels',
      'Advanced Analytics (Lifetime)',
      'UTM Presets',
      '5 Page Templates',
    ],
    cta: 'Get Mini',
    ctaHref: '/signup',
    popular: false,
  },
  {
    id: 'creator',
    name: 'Creator',
    icon: Crown,
    iconColor: '#fff',
    badge: 'Most Popular',
    price: { monthly: 24.99, annual: null },
    period: 'one-time',
    description: 'Pay once, own it forever. No subscriptions, no surprises.',
    color: '#D75852',
    bgColor: '#D75852',
    borderColor: '#D75852',
    features: [
      'Everything in Mini',
      'Remove Leynk Branding',
      'Custom Colors & Fonts',
      'Built-in Shop & Products',
      'Newsletter & Lead Capture',
      'Contact Form',
      'Link Carousels',
      '10 Page Templates',
      'Free .bio domain for 1 year',
    ],
    cta: 'Get Creator — One Time',
    ctaHref: '/signup',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Building2,
    iconColor: '#F3C845',
    badge: null,
    price: { monthly: 9.99, annual: 7.99 },
    period: 'month',
    description: 'Everything plus a custom domain, booking, AI, and team seats.',
    color: '#2C3A42',
    bgColor: '#2C3A42',
    borderColor: '#2C3A42',
    features: [
      'Everything in Creator',
      'Platform Verification Badge',
      'Connect Custom Domain',
      'Booking Calendar',
      'AI Translations',
      'Team Members & Roles',
      'Priority Support',
      'Export All Data',
    ],
    cta: 'Get Pro',
    ctaHref: '/signup',
    popular: false,
  },
];

const faqs = [
  {
    q: "What makes Leynk different from Linktree?",
    a: "Leynk offers a one-time purchase option (Creator plan) so you're never locked into a subscription. On top of links, you get a built-in shop, newsletter, contact form, and analytics — all in one page. No nickel-and-diming.",
  },
  {
    q: "Can I really pay once and own it forever?",
    a: "Yes. The Creator plan is a single $24.99 payment with no recurring fees. You keep access to all included features as long as Leynk exists, and we honor that commitment fully.",
  },
  {
    q: "Can Leynk replace my website?",
    a: "For many creators and small businesses, absolutely. Your Leynk page supports a shop, email capture, contact form, social links, booking, and custom domains — everything most personal sites need.",
  },
  {
    q: "Is it safe to put in my Instagram, TikTok or YouTube bio?",
    a: "100%. Leynk pages are hosted on secure, global infrastructure. The link is clean, fast, and works perfectly on mobile — exactly how social platforms expect bio links to behave.",
  },
  {
    q: "Can I migrate from Linktree or Beacons?",
    a: "Yes. We have a simple import flow to bring over your existing links. If you run into issues, our support team will help you migrate manually within 24 hours.",
  },
  {
    q: "Do you take a cut of my sales?",
    a: "Never. Leynk charges 0% transaction fees on anything you sell — products, digital files, services. We make money on plans, not your revenue.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #FDF5EC 0%, #F7F7EF 45%, #EEF7FA 100%)' }}
    >
      {/* Header — matches homepage */}
      <header
        className="border-b border-accent/15 sticky top-0 z-50"
        style={{ backgroundColor: 'rgba(247,247,239,0.92)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/leynk-logo.svg" alt="Leynk" width={180} height={49} priority />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-accent font-semibold hidden sm:block">Pricing</Link>
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

      <main className="max-w-6xl mx-auto px-4">

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="text-center pt-20 pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 shadow-sm">
            <Sparkles className="text-accent" size={18} />
            <span className="text-sm font-semibold text-text-primary">0% transaction fees on all plans</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-5 leading-tight">
            Simple, honest pricing.<br />
            <span className="text-accent">Pay what you need.</span>
          </h1>
          <p className="text-xl text-text-primary/65 max-w-2xl mx-auto mb-10">
            Start free, level up when you're ready — or just pay once and own it forever.
            No hidden fees, no tricks.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-full px-2 py-2 shadow-sm border border-accent/10">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!annual ? 'bg-accent text-white shadow' : 'text-text-primary/60 hover:text-text-primary'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${annual ? 'bg-accent text-white shadow' : 'text-text-primary/60 hover:text-text-primary'}`}
            >
              Annual
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: annual ? 'rgba(255,255,255,0.3)' : '#D75852', color: '#fff' }}>−20%</span>
            </button>
          </div>
        </section>

        {/* ── Pricing Cards ──────────────────────────────────────── */}
        <section className="pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {plans.map((plan) => {
              const isLight = plan.id === 'free' || plan.id === 'mini';
              const isCoral = plan.id === 'creator';
              const isDark = plan.id === 'pro';

              const textColor = isLight ? '#2C3A42' : '#fff';
              const subColor = isLight ? 'rgba(44,58,66,0.55)' : 'rgba(255,255,255,0.7)';

              const priceValue =
                plan.period === 'one-time'
                  ? plan.price.monthly
                  : annual && plan.price.annual !== null
                  ? plan.price.annual
                  : plan.price.monthly;

              const periodLabel =
                plan.period === 'one-time'
                  ? 'one-time payment'
                  : plan.period === 'forever'
                  ? 'free forever'
                  : annual
                  ? '/month, billed yearly'
                  : '/month';

              const Icon = plan.icon;

              return (
                <div
                  key={plan.id}
                  className="relative rounded-3xl p-7 flex flex-col gap-6 transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    background: plan.bgColor,
                    border: `1.5px solid ${plan.borderColor}`,
                    boxShadow: plan.popular
                      ? '0 20px 60px rgba(215,88,82,0.25)'
                      : isDark
                      ? '0 20px 60px rgba(44,58,66,0.18)'
                      : '0 4px 20px rgba(44,58,66,0.06)',
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-md"
                      style={{ background: '#F3C845', color: '#2C3A42' }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  {/* Icon + Name */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: isLight ? `${plan.color}18` : 'rgba(255,255,255,0.15)',
                      }}
                    >
                      <Icon size={20} color={isLight ? plan.color : plan.iconColor} />
                    </div>
                    <h2 className="text-xl font-bold" style={{ color: textColor }}>{plan.name}</h2>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex items-end gap-1">
                      {priceValue === 0 ? (
                        <span className="text-4xl font-extrabold leading-none" style={{ color: textColor }}>Free</span>
                      ) : (
                        <>
                          <span className="text-sm font-medium self-start mt-2" style={{ color: subColor }}>$</span>
                          <span className="text-4xl font-extrabold leading-none" style={{ color: textColor }}>{priceValue}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs mt-1 font-medium" style={{ color: subColor }}>{periodLabel}</p>
                    <p className="text-sm mt-3 leading-relaxed" style={{ color: subColor }}>{plan.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <div
                          className="mt-0.5 rounded-full p-0.5 shrink-0"
                          style={{ background: isLight ? `${plan.color}20` : 'rgba(255,255,255,0.2)' }}
                        >
                          <Check size={13} strokeWidth={3} color={isLight ? plan.color : '#fff'} />
                        </div>
                        <span style={{ color: isLight ? 'rgba(44,58,66,0.8)' : 'rgba(255,255,255,0.85)' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={plan.ctaHref}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all group"
                    style={
                      isLight
                        ? {
                            background: '#fff',
                            color: plan.color,
                            border: `1.5px solid ${plan.borderColor}`,
                            boxShadow: '0 2px 8px rgba(44,58,66,0.06)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.15)',
                            color: '#fff',
                            border: '1.5px solid rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(8px)',
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!isLight) {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.25)';
                      } else {
                        (e.currentTarget as HTMLAnchorElement).style.background = plan.bgColor === '#EFF8FB' ? '#E0F3F8' : '#F0F0E8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLight) {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.15)';
                      } else {
                        (e.currentTarget as HTMLAnchorElement).style.background = '#fff';
                      }
                    }}
                  >
                    {plan.cta}
                    <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Small-print add-ons note */}
          <p className="text-center text-text-primary/50 text-sm mt-8">
            Add-ons available: Booking Calendar ($4/mo) · AI Translations ($3/mo) · Custom Domain ($40/yr) · Verification Badge ($2/mo)
          </p>
        </section>

        {/* ── Feature Comparison ─────────────────────────────────── */}
        <section className="pb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-3">Compare plans at a glance</h2>
            <p className="text-text-primary/60">Everything side-by-side so you can pick without guessing.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-accent/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-accent/10">
                    <th className="text-left px-6 py-5 text-text-primary/60 font-semibold w-52">Feature</th>
                    {['Free', 'Mini', 'Creator', 'Pro'].map((p) => (
                      <th key={p} className="px-4 py-5 text-center font-bold text-text-primary">{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent/8">
                  {[
                    ['Unlimited Links', true, true, true, true],
                    ['Analytics', '30 days', 'Lifetime', 'Lifetime', 'Lifetime'],
                    ['Page Templates', '3', '5', '10', '10+'],
                    ['Remove Branding', false, false, true, true],
                    ['Custom Colors & Fonts', false, false, true, true],
                    ['Shop & Products', false, false, true, true],
                    ['Newsletter / Leads', false, false, true, true],
                    ['Pixels & Tracking', false, true, true, true],
                    ['Custom Domain', false, false, false, true],
                    ['Booking Calendar', false, false, false, true],
                    ['AI Translations', false, false, false, true],
                    ['Verification Badge', false, false, false, true],
                    ['Team Members', false, false, false, true],
                    ['Transaction Fees', '0%', '0%', '0%', '0%'],
                  ].map(([label, ...values], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-accent/3'} style={{ background: i % 2 !== 0 ? 'rgba(88,169,190,0.03)' : undefined }}>
                      <td className="px-6 py-4 text-text-primary/75 font-medium">{label}</td>
                      {values.map((v, j) => (
                        <td key={j} className="px-4 py-4 text-center">
                          {v === true ? (
                            <Check size={16} strokeWidth={3} color="#58A9BE" className="mx-auto" />
                          ) : v === false ? (
                            <span className="text-text-primary/20">—</span>
                          ) : (
                            <span className="font-semibold text-text-primary/80">{v}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Social Proof Strip ─────────────────────────────────── */}
        <section className="pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { stat: '0%', label: 'Transaction fees', sub: 'Keep every dollar you earn' },
              { stat: '1 URL', label: 'To rule them all', sub: 'Social, shop, newsletter & more' },
              { stat: '∞', label: 'Links on every plan', sub: 'No limits, no upsells' },
            ].map(({ stat, label, sub }) => (
              <div
                key={label}
                className="text-center rounded-3xl p-8 border border-accent/10 bg-white/60"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                <p className="text-5xl font-extrabold text-accent mb-2">{stat}</p>
                <p className="font-bold text-text-primary mb-1">{label}</p>
                <p className="text-text-primary/55 text-sm">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <section className="pb-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-3">Frequently asked questions</h2>
            <p className="text-text-primary/60">Still unsure? We've got answers.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-accent/10 overflow-hidden"
                style={{ boxShadow: '0 2px 12px rgba(44,58,66,0.04)' }}
              >
                <button
                  id={`faq-toggle-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-accent/3 transition-colors"
                  aria-expanded={openFaq === i}
                  style={{ color: '#2C3A42' }}
                >
                  <span className="font-semibold pr-4">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className="shrink-0 transition-transform duration-300"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', color: '#58A9BE' }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-text-primary/65 leading-relaxed text-sm">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ─────────────────────────────────────────── */}
        <section className="pb-24">
          <div
            className="rounded-3xl px-8 py-14 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #58A9BE 0%, #3d8fa6 100%)' }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
              Ready to own your link?
            </h2>
            <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto relative z-10">
              Free forever to start. No credit card required. One link, infinite possibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white font-bold rounded-full text-accent hover:shadow-xl hover:scale-105 transition-all"
              >
                Start For Free
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 font-semibold rounded-full text-white border border-white/30 hover:bg-white/25 transition-all"
              >
                Already have an account?
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-accent/15 bg-white/40 backdrop-blur-md py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/">
            <Image src="/leynk-logo.svg" alt="Leynk" width={120} height={33} className="hover:opacity-80 transition-opacity" />
          </Link>
          
          <div className="text-center text-text-primary/50 text-sm">
            <p className="mb-1">© {new Date().getFullYear()} Raveloo Retailers LLC — 0% transaction fees, always.</p>
            <p className="text-xs text-text-primary/40">5830 E 2nd St, Ste 7000 Casper, WY 82609 • +1 (912) 923-1747 • elmahboubi@leynk.co</p>
          </div>
          
          <div className="flex gap-5 text-sm text-text-primary/60">
            <Link href="/pricing" className="hover:text-accent font-medium transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-accent font-medium transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-accent font-medium transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
