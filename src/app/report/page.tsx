'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LeftActionButton from '@/components/LeftActionButton';
import ShareButton from '@/components/ShareButton';

export default function ReportPage() {
  const [formData, setFormData] = useState({
    reportType: '',
    fullName: '',
    email: '',
    username: '',
    description: '',
    evidence: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reportTypes = [
    'Intellectual Property Infringement',
    'Copyright Violation',
    'Trademark Violation',
    'Inappropriate Content',
    'Spam or Scam',
    'Harassment or Bullying',
    'Impersonation',
    'Other',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.reportType) {
      newErrors.reportType = 'Please select a report type';
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please provide details about your report';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Please provide more details (at least 20 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // TODO: Implement actual API call to submit report
      // For now, just simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real implementation, you would send this to your backend:
      // const response = await fetch('/api/reports', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      console.log('Report submitted:', formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg-primary">
        {/* Header */}
        <header className="w-full px-4 py-4 md:px-6 md:py-6">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <LeftActionButton />
            <div className="flex items-center gap-3">
              <ShareButton title="Report - Leynk" />
              <div className="w-10 h-10" />
            </div>
          </div>
        </header>

        {/* Success Message */}
        <div className="flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
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
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Report Submitted
              </h1>
              <p className="text-text-primary/70 mb-8 leading-relaxed">
                Thank you for your report. We take all reports very seriously and will review your submission manually within 24-48 hours. You will receive an email confirmation at {formData.email} shortly.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-accent text-white rounded-full font-semibold hover:bg-accent/90 transition-all"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="w-full px-4 py-4 md:px-6 md:py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <LeftActionButton />
          <div className="flex items-center gap-3">
            <ShareButton title="Report - Leynk" />
            <div className="w-10 h-10" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            {/* Title and Description */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Report an Issue
              </h1>
              <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 mb-6">
                <p className="text-text-primary/80 leading-relaxed font-medium mb-2">
                  We take all reports very seriously.
                </p>
                <p className="text-sm text-text-primary/70 leading-relaxed">
                  Each report is reviewed manually by our team. We investigate all claims thoroughly, 
                  including intellectual property infringement, copyright violations, inappropriate content, 
                  and other violations of our terms of service. Your report helps us maintain a safe and 
                  respectful community.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Report Type */}
              <div>
                <label
                  htmlFor="reportType"
                  className="block text-sm font-semibold text-text-primary mb-2"
                >
                  Type of Report <span className="text-red-500">*</span>
                </label>
                <select
                  id="reportType"
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary ${
                    errors.reportType
                      ? 'border-red-300'
                      : 'border-accent/20'
                  }`}
                >
                  <option value="">Select a report type</option>
                  {reportTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.reportType && (
                  <p className="mt-1 text-sm text-red-500">{errors.reportType}</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-text-primary mb-2"
                >
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary ${
                    errors.fullName
                      ? 'border-red-300'
                      : 'border-accent/20'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-text-primary mb-2"
                >
                  Your Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary ${
                    errors.email ? 'border-red-300' : 'border-accent/20'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
                <p className="mt-1 text-xs text-text-primary/50">
                  We'll send a confirmation email to this address
                </p>
              </div>

              {/* Username (optional) */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-text-primary mb-2"
                >
                  Username or Link Being Reported (Optional)
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username or leynk.co/username"
                  className="w-full px-4 py-3 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-text-primary mb-2"
                >
                  Details of Your Report <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Please provide as much detail as possible about the issue you're reporting. Include relevant information such as URLs, timestamps, and any other relevant context..."
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary resize-none ${
                    errors.description
                      ? 'border-red-300'
                      : 'border-accent/20'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
                <p className="mt-1 text-xs text-text-primary/50">
                  Minimum 20 characters. More details help us investigate faster.
                </p>
              </div>

              {/* Evidence/Additional Info */}
              <div>
                <label
                  htmlFor="evidence"
                  className="block text-sm font-semibold text-text-primary mb-2"
                >
                  Additional Information or Evidence (Optional)
                </label>
                <textarea
                  id="evidence"
                  name="evidence"
                  value={formData.evidence}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any additional information, links to evidence, or context that would help our review process..."
                  className="w-full px-4 py-3 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-accent text-white rounded-full font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {submitting ? 'Submitting Report...' : 'Submit Report'}
                </button>
                <p className="mt-3 text-xs text-text-primary/50 text-center">
                  By submitting this report, you confirm that the information provided is accurate to the best of your knowledge.
                </p>
              </div>
            </form>

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

