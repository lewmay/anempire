'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { grantBlogAccess } from '@/components/BlogLink';
import GlobalSetting1Header from '@/components/GlobalSetting1Header';
import { siteContent } from '@/content/siteContent';
import { routes } from '@/content/routes';

export default function ThankYouPage() {
  const [debugMode, setDebugMode] = useState(false);

  // Debug mode: Show header boundary when ?debugHeader=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebugMode(params.get('debugHeader') === '1');
  }, []);

  // Grant blog access when visitor completes any action
  useEffect(() => {
    grantBlogAccess();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 px-6 flex items-center justify-center">
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
      <div className="max-w-2xl mx-auto text-center pt-32">
        {/* Title */}
        <h1 className="text-[clamp(2rem,4vw,3rem)] leading-tight font-serif font-light text-neutral-800 mb-20">
          That's enough for now.
        </h1>

        {/* Body text */}
        <div className="space-y-8 mb-32">
          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-600">
            Clarity doesn't rush.
          </p>
          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-600">
            It accumulates.
          </p>
          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-600 pt-8">
            We'll reach out if there's something to add.
          </p>
        </div>

        {/* Footer link */}
        <div className="pt-12">
          <Link
            href="/"
            className="text-base font-serif font-light text-neutral-500 hover:text-neutral-700 transition-colors duration-500 border-b border-transparent hover:border-current pb-0.5"
          >
            Return to the beginning
          </Link>
        </div>
      </div>
    </div>
  );
}
