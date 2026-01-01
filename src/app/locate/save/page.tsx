'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlobalSetting1Header from '@/components/GlobalSetting1Header';
import { submitSaveForLater } from '@/app/actions/submissions';
import { grantBlogAccess } from '@/components/BlogLink';

export default function SavePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [debugMode, setDebugMode] = useState(false);

  // Debug mode: Show header boundary when ?debugHeader=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebugMode(params.get('debugHeader') === '1');
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await submitSaveForLater({ email });

    if (result.success) {
      grantBlogAccess();
      router.push('/locate/thank-you?reminder=sent');
    } else {
      setError(result.error || 'Failed to send reminder');
      setIsSubmitting(false);
    }
  };

  const handleNoThanks = () => {
    router.push('/locate/thank-you?reminder=none');
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-20 flex items-center justify-center">
      <GlobalSetting1Header />

      {/* Header gradient mask - prevents content from showing in header zone */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgb(250, 250, 250) 0%, rgb(250, 250, 250) 96px, rgba(250, 250, 250, 0) calc(96px + 10%), rgba(250, 250, 250, 0) 100%)'
          }}
        />
      </div>

      {/* Debug mode: Visual header boundary indicators */}
      {debugMode && (
        <>
          {/* Translucent overlay for header zone */}
          <div className="fixed top-0 left-0 right-0 h-24 bg-red-500/10 pointer-events-none z-[60] border-b-2 border-red-500" />
          {/* Debug label */}
          <div className="fixed top-2 right-8 text-xs text-red-600 font-mono z-[60] pointer-events-none">
            DEBUG: Header Zone (96px)
          </div>
        </>
      )}

      {/* Main content - centered, starts below header */}
      <div className="max-w-3xl mx-auto text-center pt-32">
        {/* Title */}
        <h1 className="text-[clamp(2.5rem,5vw,4rem)] leading-tight font-serif font-light text-neutral-800 mb-16">
          Save this for later
        </h1>

        {/* Body text */}
        <div className="space-y-12 mb-20">
          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-600">
            This page is dense on purpose.
          </p>

          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-600">
            If now isn't the right time to sit with it,<br />
            you can come back when it is.
          </p>

          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-600">
            You have two options.
          </p>
        </div>

        {/* Option 1: Email input */}
        <div className="mb-16">
          <p className="text-[clamp(1.5rem,3vw,2rem)] leading-relaxed font-serif font-light text-neutral-700 mb-8">
            Send me one reminder
          </p>

          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-serif font-light text-neutral-500 mb-3">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 text-lg font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <p className="text-sm font-serif font-light text-neutral-400 mb-6">
              One email only.<br />
              No sequence.<br />
              No follow-ups.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200">
                <p className="text-sm font-serif text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 text-lg font-serif font-light text-neutral-700 hover:text-neutral-900 transition-colors border-b border-transparent hover:border-current disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send reminder'}
            </button>
          </form>
        </div>

        {/* Option 2: No thanks */}
        <div className="pt-12 border-t border-neutral-300 max-w-md mx-auto">
          <button
            onClick={handleNoThanks}
            className="text-[clamp(1.5rem,3vw,2rem)] font-serif font-light text-neutral-700 hover:text-neutral-900 transition-colors border-b border-transparent hover:border-current pb-1"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
