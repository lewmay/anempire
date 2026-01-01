'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlobalSetting1Header from '@/components/GlobalSetting1Header';

export default function Home() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [textOpacity, setTextOpacity] = useState(1);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Color progression: grey to black (reaches black by 60% scroll)
  const textColor = useTransform(
    scrollYProgress,
    [0, 0.6],
    ['rgb(163, 163, 163)', 'rgb(0, 0, 0)'] // neutral-400 to black
  );

  // Font weight progression: bold (700) to light (300)
  const fontWeight = useTransform(scrollYProgress, [0, 1], [700, 300]);

  // Debug mode: Show header boundary when ?debugHeader=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebugMode(params.get('debugHeader') === '1');
  }, []);

  useEffect(() => {
    let userInteracted = false;
    let autoFadeTimeout: NodeJS.Timeout | null = null;
    let fadeInterval: NodeJS.Timeout | null = null;
    let resetTimeout: NodeJS.Timeout | null = null;

    const startFade = (duration: number) => {
      // Calculate steps for smooth fade
      const steps = 60; // 60fps
      const totalMs = duration * 1000;
      const intervalMs = totalMs / steps;
      let currentStep = 0;

      fadeInterval = setInterval(() => {
        currentStep++;
        const newOpacity = 1 - (currentStep / steps);
        setTextOpacity(Math.max(0, newOpacity));

        if (currentStep >= steps) {
          if (fadeInterval) clearInterval(fadeInterval);
          // Show "scroll down" and reset after fade completes
          setShowScrollDown(true);

          resetTimeout = setTimeout(() => {
            setTextOpacity(1);
            setShowScrollDown(false);
          }, 2000); // Show scroll down for 2s then reset
        }
      }, intervalMs);
    };

    const handleInteraction = () => {
      if (!userInteracted) {
        userInteracted = true;
        if (autoFadeTimeout) clearTimeout(autoFadeTimeout);
        // Start immediate 6-second fade
        startFade(6);
      }
    };

    // Set up automatic fade after 4 seconds
    autoFadeTimeout = setTimeout(() => {
      if (!userInteracted) {
        userInteracted = true;
        // Start 2-second fade after 4s wait
        startFade(2);
      }
    }, 4000);

    // Listen for user interactions
    window.addEventListener('mousemove', handleInteraction, { once: true });
    window.addEventListener('wheel', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('scroll', handleInteraction, { once: true });

    return () => {
      if (autoFadeTimeout) clearTimeout(autoFadeTimeout);
      if (fadeInterval) clearInterval(fadeInterval);
      if (resetTimeout) clearTimeout(resetTimeout);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  // Detect when user reaches the bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if user has scrolled to near the bottom (within 100px)
      if (scrollPosition >= documentHeight - 100 && !reachedBottom) {
        setReachedBottom(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reachedBottom]);

  // Handle navigation
  useEffect(() => {
    if (selectedPath === 'pattern') {
      router.push('/pattern');
    }
  }, [selectedPath, router]);

  return (
    <div ref={containerRef} className="relative bg-neutral-50">
      <GlobalSetting1Header />

      {/* Scroll down indicator - bottom left, shows during reset */}
      {showScrollDown && (
        <div className="fixed bottom-8 left-8 z-50">
          <p className="text-sm text-neutral-400 tracking-wide font-light">scroll down</p>
        </div>
      )}

      {/* Viewport gradient mask - fades at top and bottom, starts below header (h-24 = 96px) */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(250, 250, 250, 1) 0%, rgba(250, 250, 250, 1) 96px, rgba(250, 250, 250, 0) calc(96px + 15%), rgba(250, 250, 250, 0) 85%, rgba(250, 250, 250, 1) 100%)'
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

      {/* Section 1 – Opening Frame */}
      <section className="h-screen flex items-center justify-center px-6">
        <motion.div
          className="max-w-6xl"
          style={{
            color: textColor,
            fontWeight: fontWeight,
            opacity: reachedBottom ? 1 : textOpacity
          }}
        >
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.15] text-center font-serif">
            Most marketing<br className="md:hidden" /> doesn't fail loudly.
            <br />
            <span className="block mt-6">It fades.</span>
          </h1>
        </motion.div>
      </section>

      {/* Section 2 – Lived Experience */}
      <section className="h-screen flex items-center justify-center px-6">
        <motion.div className="max-w-3xl space-y-20" style={{ color: textColor, fontWeight }}>
          <div className="space-y-4">
            <p className="text-[clamp(1.75rem,4vw,3rem)] leading-relaxed text-center">
              Campaigns run.
            </p>
            <p className="text-[clamp(1.75rem,4vw,3rem)] leading-relaxed text-center">
              Metrics move.
            </p>
            <p className="text-[clamp(1.75rem,4vw,3rem)] leading-relaxed text-center">
              Then everything resets.
            </p>
          </div>

          <div className="pt-8 border-t border-neutral-300">
            <p className="text-[clamp(1.5rem,3.5vw,2.5rem)] leading-relaxed text-center">
              Not because the work was bad...
              <br />
              but because it lived on its own.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Section 3 – Structural Explanation */}
      <section className="h-screen flex items-center justify-center px-6">
        <motion.div className="max-w-3xl space-y-16" style={{ color: textColor, fontWeight }}>
          <p className="text-[clamp(1.5rem,3.5vw,2.5rem)] leading-[1.5] text-center">
            When marketing isn't designed to connect
            <br />
            to how a business actually operates,
            <br />
            it can't compound.
          </p>
          <div className="space-y-3 pt-8">
            <p className="text-[clamp(1.25rem,3vw,2rem)] leading-relaxed text-center">
              No matter how creative it is.
            </p>
            <p className="text-[clamp(1.25rem,3vw,2rem)] leading-relaxed text-center">
              No matter who builds it.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Section 4 – Pattern Recognition */}
      <section className="h-screen flex items-center justify-center px-6">
        <motion.div className="max-w-3xl space-y-16" style={{ color: textColor, fontWeight }}>
          <p className="text-[clamp(1.75rem,4vw,3rem)] leading-relaxed text-center">
            You will see this pattern repeat
            <br />
            across service businesses.
          </p>
          <div className="space-y-3 pt-8">
            <p className="text-[clamp(1.25rem,3vw,2rem)] leading-relaxed text-center">
              Different industries.
            </p>
            <p className="text-[clamp(1.25rem,3vw,2rem)] leading-relaxed text-center">
              Same outcome.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Section 5 – Soft-Control Choice */}
      <section className="h-screen flex items-center justify-center px-6">
        <motion.div className="max-w-5xl text-center space-y-24 font-light" style={{ color: textColor }}>
          <p className="text-[clamp(2rem,4.5vw,3.5rem)] leading-tight whitespace-nowrap">
            What do you want to do next?
          </p>

          <div className="flex flex-col items-center gap-10">
            <button
              onClick={() => setSelectedPath('pattern')}
              className="text-xl md:text-2xl hover:opacity-70 transition-opacity duration-500 border-b border-transparent hover:border-current pb-1"
            >
              Follow the pattern
            </button>

            <Link
              href="/locate"
              className="text-xl md:text-2xl hover:opacity-70 transition-opacity duration-500 border-b border-transparent hover:border-current pb-1"
            >
              Locate your business inside it
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
