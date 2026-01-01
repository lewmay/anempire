'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import GlobalSetting1Header from '@/components/GlobalSetting1Header';

export const dynamic = 'force-dynamic';

function ResultsContent() {
  const searchParams = useSearchParams();
  const state = searchParams.get('state');
  const yesCount = searchParams.get('yes');
  const [debugMode, setDebugMode] = useState(false);

  // Debug mode: Show header boundary when ?debugHeader=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebugMode(params.get('debugHeader') === '1');
  }, []);

  const stateLabels: { [key: string]: string } = {
    'manual-loop': 'Manual Loop',
    'partial-loop': 'Partial Loop',
    'closed-loop': 'Closed Loop',
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
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

      <div className="max-w-3xl text-center space-y-8 pt-24">
        <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] leading-tight font-serif font-light text-neutral-800">
          {state && stateLabels[state]}
        </h1>

        <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-600">
          You answered "Yes" to {yesCount} out of 9 questions.
        </p>

        <div className="pt-8">
          <p className="text-lg text-neutral-500 font-serif font-light">
            Results page content coming soon...
          </p>
        </div>

        <div className="pt-12">
          <Link
            href="/"
            className="text-xl font-serif text-neutral-600 hover:text-neutral-900 transition-colors border-b border-transparent hover:border-current pb-1"
          >
            Return to overview
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-400">Loading...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
