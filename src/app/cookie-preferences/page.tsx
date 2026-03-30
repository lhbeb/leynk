'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LeftActionButton from '@/components/LeftActionButton';
import ShareButton from '@/components/ShareButton';
import NotificationButton from '@/components/NotificationButton';

export default function CookiePreferencesPage() {
  const [preferences, setPreferences] = useState({
    essential: true, // Always required, cannot be disabled
    analytics: true,
    marketing: false,
    functional: true,
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof typeof preferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // TODO: Implement actual cookie preference saving logic
    // For now, just save to localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const cookieTypes = [
    {
      key: 'essential' as const,
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.',
      required: true,
    },
    {
      key: 'functional' as const,
      title: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.',
      required: false,
    },
    {
      key: 'analytics' as const,
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and your experience.',
      required: false,
    },
    {
      key: 'marketing' as const,
      title: 'Marketing Cookies',
      description: 'These cookies are used to track visitors across websites to display relevant advertisements and measure the effectiveness of our marketing campaigns.',
      required: false,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header - Action Buttons at Top */}
      <header className="w-full px-4 py-4 md:px-6 md:py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <LeftActionButton />
          <div className="flex items-center gap-3">
            <ShareButton 
              title="Cookie Preferences - Leynk"
            />
            {/* Notification button disabled for this page */}
            <div className="w-10 h-10" /> {/* Spacer to maintain layout */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
                Cookie Preferences
              </h1>
              <p className="text-text-primary/70 leading-relaxed">
                Manage your cookie preferences. You can enable or disable different types of cookies below. Your preferences will be saved for this browser.
              </p>
            </div>

            {/* Cookie Types */}
            <div className="space-y-6 mb-8">
              {cookieTypes.map((cookie) => (
                <div
                  key={cookie.key}
                  className="p-6 border border-accent/20 rounded-2xl hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {cookie.title}
                        {cookie.required && (
                          <span className="ml-2 text-xs text-text-primary/50 font-normal">
                            (Required)
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-text-primary/70 leading-relaxed">
                        {cookie.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle(cookie.key)}
                      disabled={cookie.required}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                        preferences[cookie.key]
                          ? 'bg-accent'
                          : 'bg-gray-300'
                      } ${cookie.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      aria-label={`Toggle ${cookie.title}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences[cookie.key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-accent/10">
              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-8 py-3 bg-accent text-white rounded-full font-semibold hover:bg-accent/90 transition-all shadow-sm hover:shadow-md"
              >
                {saved ? 'Preferences Saved!' : 'Save Preferences'}
              </button>
              {saved && (
                <p className="text-sm text-accent">
                  Your preferences have been saved.
                </p>
              )}
            </div>

            {/* Footer Links */}
            <div className="mt-12 pt-6 border-t border-accent/10">
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-text-primary/50 mb-6">
                <Link
                  href="/cookie-preferences"
                  className="hover:text-text-primary transition-colors"
                >
                  Cookie Preferences
                </Link>
                <span className="text-text-primary/30">·</span>
                <Link
                  href="/report"
                  className="hover:text-text-primary transition-colors"
                >
                  Report
                </Link>
                <span className="text-text-primary/30">·</span>
                <Link
                  href="/privacy"
                  className="hover:text-text-primary transition-colors"
                >
                  Privacy
                </Link>
              </div>
              
              {/* Powered by Leynk */}
              <div className="text-center">
                <Link
                  href="/"
                  className="inline-flex flex-col items-center gap-2 group"
                >
                  <span className="text-xs text-text-primary/40 group-hover:text-text-primary/60 transition-colors">Powered by</span>
                  <Image 
                    src="/leynk-logo.svg" 
                    alt="Leynk" 
                    width={150} 
                    height={41}
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

