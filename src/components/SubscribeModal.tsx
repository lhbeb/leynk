'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export default function SubscribeModal({ isOpen, onClose, username }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      return;
    }

    setSubmitting(true);
    
    try {
      // Call subscription API
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setSubmitting(false);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setEmail('');
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Subscription failed:', errorData);
        alert('Failed to subscribe. Please try again.');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to subscribe. Please try again.');
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="text-text-primary/60" size={20} />
        </button>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Subscribe to "{username}"
              </h2>
              <p className="text-text-primary/70">
                Stay up to date with everything important.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !email}
                className="w-full px-6 py-3 bg-accent text-white rounded-full font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            {/* Notice */}
            <p className="text-xs text-text-primary/50 mt-6 leading-relaxed">
              By subscribing, you agree to Leynk's T&Cs and Privacy Notice, and to your contact details being shared with laclippers, who may contact you.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Subscribed!
            </h3>
            <p className="text-text-primary/70">
              You're now subscribed to updates from {username}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

