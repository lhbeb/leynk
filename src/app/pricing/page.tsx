import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/forever",
      description: "Everything you need to kickstart your presence.",
      features: [
        "Unlimited Links",
        "Standard Themes",
        "Basic Analytics (30 days)",
        "QR Code generation"
      ],
      buttonText: "Start For Free",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Pro",
      price: "$12",
      period: "/month",
      description: "Advanced tools for growing creators & businesses.",
      features: [
        "Everything in Free",
        "Custom Branding & Themes",
        "Premium Templates",
        "Remove Leynk Logo",
        "Collect Emails & Phone numbers",
        "Advanced Analytics (Lifetime)"
      ],
      buttonText: "Get Pro",
      buttonVariant: "solid",
      popular: true
    },
    {
      name: "Agency",
      price: "$49",
      period: "/month",
      description: "Manage multiple brands and teams with ease.",
      features: [
        "Everything in Pro",
        "Manage up to 10 profiles",
        "Team Members & Roles",
        "Custom Domain Mapping",
        "Priority Support",
        "Export Data"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FDF5EC' }}>
      {/* Header */}
      <header className="px-6 py-6 border-b border-accent/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <Image src="/leynk-logo.svg" alt="Leynk" width={140} height={38} />
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-text-primary font-medium hover:text-accent">Login</Link>
            <Link href="/signup" className="px-5 py-2 bg-accent text-white rounded-full font-semibold hover:bg-accent/90">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-20 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">Simple, transparent pricing</h1>
          <p className="text-xl text-text-primary/70 max-w-2xl mx-auto">
            Whether you're just starting out or managing an entire global brand, we have a plan for you.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-3xl p-8 border ${plan.popular ? 'border-accent shadow-xl scale-105 z-10' : 'border-accent/15 shadow-md'} flex flex-col justify-between`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-md">
                  Most Popular
                </div>
              )}
              
              <div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                <p className="text-text-primary/60 text-sm mb-6 h-10">{plan.description}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-text-primary">{plan.price}</span>
                  <span className="text-text-primary/50 font-medium">{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 bg-accent/10 p-0.5 rounded-full text-accent shrink-0">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-text-primary/80 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => alert(`Fake Action: Selected ${plan.name} Plan`)}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.buttonVariant === 'solid' 
                    ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20' 
                    : 'bg-transparent text-accent border-2 border-accent hover:bg-accent/5'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
