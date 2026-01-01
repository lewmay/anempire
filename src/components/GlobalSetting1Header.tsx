'use client';

import Link from 'next/link';

export default function GlobalSetting1Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Header zone with equal spacing above and below logo */}
      <div className="h-24 flex items-center px-8 pointer-events-auto">
        <Link href="/">
          <p className="text-sm text-neutral-800 hover:text-neutral-600 transition-colors tracking-wide font-light">
            anEmpire
          </p>
        </Link>
      </div>
    </header>
  );
}
