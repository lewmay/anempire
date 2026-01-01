'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import GlobalSetting1Header from '@/components/GlobalSetting1Header';

export default function LocatePage() {
  const [debugMode, setDebugMode] = useState(false);

  // Debug mode: Show header boundary when ?debugHeader=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebugMode(params.get('debugHeader') === '1');
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 px-6">
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

      {/* Main container - content starts below header (h-24 = 96px) */}
      <div className="max-w-3xl mx-auto pt-40 md:pt-48">
        {/* Main text */}
        <div className="space-y-8 text-neutral-600">
          <p className="text-[clamp(1.5rem,3.5vw,2.25rem)] leading-relaxed font-serif font-light">
            Here's where you would normally take a quiz.
          </p>

          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light">
            We'd ask you a few questions.<br />
            We'd score the answers.<br />
            Then we'd tell you what you already know.
          </p>

          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light pt-4">
            Instead, we'll show you the three patterns businesses actually fall into,and what changes when they move out of them.
          </p>

          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light">
            No scoring.<br />
            No judgment.<br />
            No guessing.
          </p>

          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light pt-8">
            One thing before you continue.
          </p>

          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light">
            You've already done a lot of thinking here.<br />
            What comes next is heavier.
          </p>

          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light pt-8">
            If you didn't read{' '}
            <Link
              href="/pattern"
              className="text-neutral-700 hover:text-neutral-900 transition-colors duration-500 border-b border-transparent hover:border-current"
            >
              "Follow the Pattern"
            </Link>{' '}
            would you like to?
          </p>
        </div>

        {/* Spacer to push links section down */}
        <div className="h-[calc(50vh-14rem)]" />

        {/* Links section */}
        <div className="space-y-16">
          <div className="flex flex-col gap-6">
            <Link
              href="/locate/patterns"
              className="text-xl md:text-2xl text-neutral-700 hover:text-neutral-900 transition-colors duration-500 border-b border-transparent hover:border-current pb-1 inline-block w-fit font-serif font-light"
            >
              Look at this now
            </Link>

            <Link
              href="/locate/save"
              className="text-xl md:text-2xl text-neutral-700 hover:text-neutral-900 transition-colors duration-500 border-b border-transparent hover:border-current pb-1 inline-block w-fit font-serif font-light"
            >
              Save this for later
            </Link>
          </div>

          {/* Reassurance text */}
          <div>
            <p className="text-sm text-neutral-400 leading-relaxed font-serif font-light">
              If you step away, that's fine.<br />
              This isn't going anywhere.<br />
              If this matters, you'll come back to it.
            </p>
          </div>
        </div>

        {/* Bottom spacer for scroll room */}
        <div className="h-32" />
      </div>
    </div>
  );
}
