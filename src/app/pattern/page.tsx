'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import GlobalSetting1Header from '@/components/GlobalSetting1Header';

export default function PatternPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [debugMode, setDebugMode] = useState(false);

  // Debug mode: Show header boundary when ?debugHeader=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebugMode(params.get('debugHeader') === '1');
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Background: white to warm red-tinted off-white
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['rgb(255, 255, 255)', 'rgb(255, 250, 248)'] // Pure white to subtle warm tint
  );

  // Text: charcoal to soft neutral gray
  const textColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['rgb(38, 38, 38)', 'rgb(115, 115, 115)'] // Near-black to comfortable gray
  );

  // Diagram lines: dark to warm red
  const diagramColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['rgb(38, 38, 38)', 'rgb(220, 100, 80)'] // Dark to warm red
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ backgroundColor }}
      className="min-h-screen"
    >
      <GlobalSetting1Header />

      {/* Header gradient mask - prevents content from showing in header zone */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: useTransform(
            scrollYProgress,
            [0, 1],
            [
              'linear-gradient(to bottom, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 96px, rgba(255, 255, 255, 0) calc(96px + 10%), rgba(255, 255, 255, 0) 100%)',
              'linear-gradient(to bottom, rgb(255, 250, 248) 0%, rgb(255, 250, 248) 96px, rgba(255, 250, 248, 0) calc(96px + 10%), rgba(255, 250, 248, 0) 100%)'
            ]
          )
        }}
      />

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

      {/* Main Content Container - starts below header (h-24 = 96px) */}
      <div className="max-w-7xl mx-auto px-6 pt-32 md:pt-40 pb-24 md:pb-32">
        {/* Opening Statement */}
        <section className="mb-32 md:mb-48">
          <motion.h1
            style={{ color: textColor }}
            className="text-[clamp(2rem,4.5vw,3.5rem)] leading-tight max-w-4xl font-serif font-light"
          >
            The pattern is structural.
            <br />
            Not tactical.
          </motion.h1>
        </section>

        {/* Two-Column Layout: Diagram + Text */}
        <section className="grid md:grid-cols-2 gap-16 md:gap-24 mb-32 md:mb-48">
          {/* Left: Diagram */}
          <div className="order-2 md:order-1 sticky top-32 md:top-40 self-start">
            <BridgeDiagram scrollProgress={scrollYProgress} lineColor={diagramColor} />
          </div>

          {/* Right: Text Sections */}
          <div className="order-1 md:order-2 space-y-24 md:space-y-32">
            <motion.div style={{ color: textColor }} className="space-y-6">
              <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light">
                Most businesses treat marketing as something separate.
              </p>
              <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light">
                Something added after decisions are already made.
              </p>
            </motion.div>

            <motion.div style={{ color: textColor }} className="space-y-6">
              <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light">
                So campaigns launch without a connection to how value is actually created.
              </p>
              <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light">
                They float.
              </p>
            </motion.div>

            <motion.div style={{ color: textColor }} className="space-y-6 pt-8 border-t border-neutral-300">
              <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light">
                Even when the creative is brilliant.
                <br />
                Even when the spend is significant.
              </p>
            </motion.div>

            <motion.div style={{ color: textColor }} className="space-y-6">
              <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light">
                Because the bridge was never built.
              </p>
            </motion.div>

            <motion.div style={{ color: textColor }} className="space-y-6 pt-8">
              <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light">
                So friction stays invisible and the
constraints go unchallenged.
              </p>
              <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light">
                Because the system that should have surfaced the roadblocks to growth 
never existed.
              </p>
            </motion.div>

            <motion.div style={{ color: textColor }} className="space-y-6 pt-8 border-t border-neutral-300">
              <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light">
                That's the pattern.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Spacer to position final section */}
        <div className="h-[calc(100vh-12rem)]" />

        {/* Final Question & Links */}
        <section className="mb-32 max-w-4xl">
          <motion.div style={{ color: textColor }} className="space-y-16">
            <p className="text-[clamp(1.75rem,4vw,3rem)] leading-tight font-serif font-light">
              Where is your business in this pattern?
            </p>

            <div className="flex flex-col gap-8 pt-8">
              <Link
                href="/locate"
                className="text-xl md:text-2xl hover:opacity-70 transition-opacity duration-500 border-b border-transparent hover:border-current pb-1 inline-block w-fit"
              >
                Locate your business inside the pattern
              </Link>

              <Link
                href="/"
                className="text-xl md:text-2xl hover:opacity-70 transition-opacity duration-500 border-b border-transparent hover:border-current pb-1 inline-block w-fit"
              >
                Step back to the overview
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
}

import type { MotionValue } from 'framer-motion';

// Bridge Diagram Component - Through Arch Bridge
function BridgeDiagram({
  scrollProgress,
  lineColor,
}: {
  scrollProgress: MotionValue<number>;
  lineColor: MotionValue<string>;
}) {
  // Bridge extension: grows from 0 to 0.75 (never fully completes)
  const bridgeExtension = useTransform(scrollProgress, [0, 0.6, 0.75, 1], [0, 0.75, 0.75, 0.65]);

  return (
    <svg
      viewBox="0 0 700 400"
      className="w-full h-auto"
      style={{ maxWidth: '800px' }}
    >
      {/* Main arch - thick curved top */}
      <motion.path
        d="M 50 180 Q 350 60 650 180"
        fill="none"
        stroke={lineColor}
        strokeWidth="18"
        strokeLinecap="round"
        style={{
          pathLength: bridgeExtension,
        }}
      />

      {/* Inner arch edge */}
      <motion.path
        d="M 60 185 Q 350 72 640 185"
        fill="none"
        stroke={lineColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{
          pathLength: bridgeExtension,
        }}
      />

      {/* Deck beam - thick horizontal through middle */}
      <motion.path
        d="M 50 220 L 650 220"
        stroke={lineColor}
        strokeWidth="12"
        strokeLinecap="butt"
        style={{
          pathLength: bridgeExtension,
        }}
      />

      {/* Vertical post 1 */}
      <motion.line
        x1="100"
        y1="165"
        x2="100"
        y2="220"
        stroke={lineColor}
        strokeWidth="2.5"
        style={{
          opacity: useTransform(bridgeExtension, [0, 0.1], [0, 1]),
        }}
      />

      {/* X-brace 1 */}
      <motion.path
        d="M 50 180 L 100 220"
        stroke={lineColor}
        strokeWidth="2"
        style={{
          opacity: useTransform(bridgeExtension, [0, 0.1], [0, 1]),
        }}
      />
      <motion.path
        d="M 100 165 L 50 220"
        stroke={lineColor}
        strokeWidth="2"
        style={{
          opacity: useTransform(bridgeExtension, [0, 0.1], [0, 1]),
        }}
      />

      {/* Vertical post 2 */}
      <motion.line
        x1="170"
        y1="125"
        x2="170"
        y2="220"
        stroke={lineColor}
        strokeWidth="2.5"
        style={{
          opacity: useTransform(bridgeExtension, [0.1, 0.22], [0, 1]),
        }}
      />

      {/* X-brace 2 */}
      <motion.path
        d="M 100 165 L 170 220"
        stroke={lineColor}
        strokeWidth="2"
        style={{
          opacity: useTransform(bridgeExtension, [0.1, 0.22], [0, 1]),
        }}
      />
      <motion.path
        d="M 170 125 L 100 220"
        stroke={lineColor}
        strokeWidth="2"
        style={{
          opacity: useTransform(bridgeExtension, [0.1, 0.22], [0, 1]),
        }}
      />

      {/* Vertical post 3 */}
      <motion.line
        x1="250"
        y1="90"
        x2="250"
        y2="220"
        stroke={lineColor}
        strokeWidth="2.5"
        style={{
          opacity: useTransform(bridgeExtension, [0.22, 0.36], [0, 1]),
        }}
      />

      {/* X-brace 3 */}
      <motion.path
        d="M 170 125 L 250 220"
        stroke={lineColor}
        strokeWidth="2"
        style={{
          opacity: useTransform(bridgeExtension, [0.22, 0.36], [0, 1]),
        }}
      />
      <motion.path
        d="M 250 90 L 170 220"
        stroke={lineColor}
        strokeWidth="2"
        style={{
          opacity: useTransform(bridgeExtension, [0.22, 0.36], [0, 1]),
        }}
      />

      {/* Vertical post 4 (center - tallest) */}
      <motion.line
        x1="350"
        y1="70"
        x2="350"
        y2="220"
        stroke={lineColor}
        strokeWidth="2.5"
        style={{
          opacity: useTransform(bridgeExtension, [0.36, 0.5], [0, 1]),
        }}
      />

      {/* X-brace 4 */}
      <motion.path
        d="M 250 90 L 350 220"
        stroke={lineColor}
        strokeWidth="2"
        style={{
          opacity: useTransform(bridgeExtension, [0.36, 0.5], [0, 1]),
        }}
      />
      <motion.path
        d="M 350 70 L 250 220"
        stroke={lineColor}
        strokeWidth="2"
        style={{
          opacity: useTransform(bridgeExtension, [0.36, 0.5], [0, 1]),
        }}
      />

      {/* Vertical post 5 */}
      <motion.line
        x1="450"
        y1="90"
        x2="450"
        y2="220"
        stroke={lineColor}
        strokeWidth="2.5"
        style={{
          opacity: useTransform(bridgeExtension, [0.5, 0.64], [0, 1]),
        }}
      />

      {/* X-brace 5 */}
      <motion.path
        d="M 350 70 L 450 220"
        stroke={lineColor}
        strokeWidth="2"
        style={{
          opacity: useTransform(bridgeExtension, [0.5, 0.64], [0, 1]),
        }}
      />
      <motion.path
        d="M 450 90 L 350 220"
        stroke={lineColor}
        strokeWidth="2"
        style={{
          opacity: useTransform(bridgeExtension, [0.5, 0.64], [0, 1]),
        }}
      />

      {/* Vertical post 6 */}
      <motion.line
        x1="530"
        y1="125"
        x2="530"
        y2="220"
        stroke={lineColor}
        strokeWidth="2.5"
        style={{
          opacity: useTransform(bridgeExtension, [0.64, 0.75], [0, 0.8]),
        }}
      />

      {/* X-brace 6 (incomplete) */}
      <motion.path
        d="M 450 90 L 530 220"
        stroke={lineColor}
        strokeWidth="2"
        style={{
          opacity: useTransform(bridgeExtension, [0.64, 0.75], [0, 0.6]),
        }}
      />

      {/* Lower support structure - left */}
      <motion.path
        d="M 50 220 L 120 380"
        stroke={lineColor}
        strokeWidth="14"
        strokeLinecap="butt"
        style={{
          pathLength: bridgeExtension,
        }}
      />

      {/* Lower support structure - right */}
      <motion.path
        d="M 650 220 L 580 380"
        stroke={lineColor}
        strokeWidth="14"
        strokeLinecap="butt"
        style={{
          pathLength: bridgeExtension,
        }}
      />
    </svg>
  );
}
