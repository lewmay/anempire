'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { grantBlogAccess } from '@/components/BlogLink';
import GlobalSetting1Header from '@/components/GlobalSetting1Header';
import { routes } from '@/content/routes';

export default function PatternsPage() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  // Grant blog access when visitor reaches this page
  useEffect(() => {
    grantBlogAccess();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;

      let closestSection = null;
      let closestDistance = Infinity;

      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const distance = Math.abs(sectionCenter - viewportCenter);

          if (distance < closestDistance && rect.top < viewportCenter && rect.bottom > viewportCenter) {
            closestDistance = distance;
            closestSection = index;
          }
        }
      });

      setActiveSection(closestSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f1eb] px-6 py-16">
      <GlobalSetting1Header />

      {/* Document Panel - starts below header (h-24 = 96px) */}
      <div
        className="max-w-2xl mx-auto bg-[#fdfcfa] px-16 md:px-24 py-20 md:py-28 mt-24"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.03)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      >
        {/* Title */}
        <header className="mb-20">
          <h1 className="text-4xl md:text-5xl font-serif font-normal text-neutral-900 mb-6 tracking-tight leading-tight">
            The Pattern Explained
          </h1>
          <p className="text-xl md:text-2xl text-neutral-700 font-serif font-light leading-relaxed italic">
            When owner-led firms actually move from effort to compounding
          </p>
        </header>

        {/* Opening Section */}
        <div
          ref={(el) => { sectionRefs.current[0] = el; }}
          className="mb-16 transition-opacity duration-700"
          style={{
            opacity: activeSection === null || activeSection === 0 ? 1 : 0.5
          }}
        >
          <div className="space-y-6 text-neutral-800 font-serif leading-relaxed text-lg">
            <p>Many owner-led firms operate inside the pattern.<br />
            Outliers don't escape it.<br />
            They move through it.</p>

            <p>If there had been a quiz before this page,<br />
            one of the following would have been your result.</p>

            <p>Instead of scoring it,<br />
            what follows is a clearer way to see what's actually happening inside a business<br />
            as it grows, or stalls.</p>

            <p>These aren't stages.<br />
            They aren't maturity levels.<br />
            They aren't opinions.</p>

            <p>It's awareness.</p>

            <p>Each one changes what the owner can see,<br />
            what they act on,<br />
            and what kind of growth becomes possible.</p>
          </div>
        </div>

        {/* Section Divider */}
        <div className="my-16 border-t border-neutral-300" />

        {/* First Awareness */}
        <div
          ref={(el) => { sectionRefs.current[1] = el; }}
          className="mb-16 transition-opacity duration-700"
          style={{
            opacity: activeSection === null || activeSection === 1 ? 1 : 0.5
          }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-normal text-neutral-900 mb-8 tracking-tight">
            First Awareness
          </h2>
          <p className="text-xl font-serif italic text-neutral-700 mb-10">
            Effort is carrying the business
          </p>

          <div className="space-y-6 text-neutral-800 font-serif leading-relaxed text-lg">
            <p>The business works.</p>

            <p>Revenue comes in.<br />
            Clients are served.<br />
            From the outside, everything looks fine.</p>

            <p>Inside, everything depends on effort.</p>

            <p>The owner fills gaps.<br />
            The team stretches.<br />
            Experience covers what isn't visible.</p>

            <p>When leads stall, someone remembers.<br />
            When demand spikes, people absorb it.<br />
            When delivery slips, effort increases.</p>

            <p>Marketing exists in some form.</p>

            <p>It might be referrals.<br />
            It might be word of mouth.<br />
            It might be marketing that must be working…<br />
            because something keeps the business moving.</p>

            <p>Nothing is coordinated end to end.<br />
            Nothing is observable as a whole.</p>

            <p>This is also where an important realization usually happens.</p>

            <p>At some point, the owner knows they can't do everything themselves anymore.<br />
            Not emotionally.<br />
            Structurally.</p>

            <p>They see that effort is carrying the business,<br />
            and that effort has a ceiling.</p>

            <p>The realization is correct.</p>

            <p>But on its own, it doesn't change the business.<br />
            It only explains why things feel tight.</p>

            <p>So the business continues.</p>

            <p>Successful enough to persist.<br />
            Fragile enough to feel pressure.<br />
            Caught between stability and the sense that more is possible.</p>
          </div>
        </div>

        {/* Section Divider */}
        <div className="my-16 border-t border-neutral-300" />

        {/* Second Awareness */}
        <div
          ref={(el) => { sectionRefs.current[2] = el; }}
          className="mb-16 transition-opacity duration-700"
          style={{
            opacity: activeSection === null || activeSection === 2 ? 1 : 0.5
          }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-normal text-neutral-900 mb-8 tracking-tight">
            Second Awareness
          </h2>
          <p className="text-xl font-serif italic text-neutral-700 mb-10">
            Growth reveals what was invisible
          </p>

          <div className="space-y-6 text-neutral-800 font-serif leading-relaxed text-lg">
            <p>This is where movement begins.</p>

            <p>Not because of belief.<br />
            Because growth demands answers.</p>

            <p>The question shifts from<br />
            "What should we do?"<br />
            to<br />
            "What is limiting us right now?"</p>

            <p>The answers are specific.</p>

            <p>A missed moment.<br />
            Friction in a conversation.<br />
            Capacity that breaks under load.<br />
            A handoff no one noticed until it failed.</p>

            <p>One thing gets addressed.</p>

            <p>The business responds.</p>

            <p>Revenue moves.<br />
            Not hypothetically.<br />
            In reality.</p>

            <p>That result justifies the next action.</p>

            <p>Another constraint surfaces.<br />
            Another improvement is made.</p>

            <p>Some changes are clearly transitional.<br />
            Some become permanent.</p>

            <p>That distinction doesn't matter yet.</p>

            <p>What matters is that each change holds under more pressure than before.</p>

            <p>Marketing becomes clearer, not because it's perfected,<br />
            but because the business can absorb what it creates.</p>

            <p>Sales becomes smoother, not because it's optimized,<br />
            but because friction is removed.</p>

            <p>Operations improve, not because everything is redesigned,<br />
            but because obvious breakdowns stop compounding.</p>

            <p>Not everything is measured.<br />
            Many improvements never will be…<br />
            because they'll be replaced again as the business grows.</p>

            <p>This is not about building systems.</p>

            <p>Systems emerge because progress demands consistency.</p>

            <p>Action continues because results are felt.<br />
            Confidence grows because improvements stack.<br />
            Delegation becomes safer because responsibility is taken on gradually.</p>

            <p>The business stops guessing.<br />
            It starts learning, one constraint at a time.</p>
          </div>
        </div>

        {/* Section Divider */}
        <div className="my-16 border-t border-neutral-300" />

        {/* Third Awareness */}
        <div
          ref={(el) => { sectionRefs.current[3] = el; }}
          className="mb-16 transition-opacity duration-700"
          style={{
            opacity: activeSection === null || activeSection === 3 ? 1 : 0.5
          }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-normal text-neutral-900 mb-8 tracking-tight">
            Third Awareness
          </h2>
          <p className="text-xl font-serif italic text-neutral-700 mb-10">
            The business can now carry growth
          </p>

          <div className="space-y-6 text-neutral-800 font-serif leading-relaxed text-lg">
            <p>Eventually, the business reaches a different state.</p>

            <p>Not finished.<br />
            Not perfect.</p>

            <p>But stable enough that growth no longer feels dangerous.</p>

            <p>Demand is visible.<br />
            Movement is observable.<br />
            Slowdowns surface early.</p>

            <p>Changes don't rely on memory or heroics.<br />
            They hold.</p>

            <p>At this point, deeper work finally makes sense.</p>

            <p>Language matters.<br />
            Positioning matters.<br />
            Brand and buyer psychology matter.</p>

            <p>Not because they're trendy,<br />
            but because the machine underneath can now support precision.</p>

            <p>Constraints don't disappear.<br />
            They move.</p>

            <p>But when they move into view,<br />
            they can be addressed intentionally.<br />
            At the right time.<br />
            With the right level of investment.</p>

            <p>This is the difference between operating inside the pattern<br />
            and moving through it.</p>
          </div>
        </div>

        {/* Section Divider */}
        <div className="my-16 border-t border-neutral-300" />

        {/* Closing Section */}
        <div
          ref={(el) => { sectionRefs.current[4] = el; }}
          className="mb-16 transition-opacity duration-700"
          style={{
            opacity: activeSection === null || activeSection === 4 ? 1 : 0.5
          }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-normal text-neutral-900 mb-8 tracking-tight">
            Where this leaves you
          </h2>

          <div className="space-y-6 text-neutral-800 font-serif leading-relaxed text-lg">
            <p>Many businesses never get a clear view of this progression.</p>

            <p>They feel it.<br />
            But they can't see it.</p>

            <p>If you recognized your business in one of these awarenesses,<br />
            nothing needs to happen immediately.</p>

            <p>Some owners want to pressure-test what they're seeing.<br />
            Some are ready to take responsibility for changing it.<br />
            Some just need to sit with it.</p>

            <p>All of those are reasonable.</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-20 pt-12 border-t border-neutral-300 flex flex-col gap-8">
          <Link
            href="/ask"
            className="text-base md:text-lg font-serif text-neutral-700 hover:text-neutral-900 transition-colors duration-300 border-b border-transparent hover:border-current pb-1 inline-block w-fit"
          >
            Ask a question
          </Link>

          <Link
            href="/conversation"
            className="text-base md:text-lg font-serif text-neutral-700 hover:text-neutral-900 transition-colors duration-300 border-b border-transparent hover:border-current pb-1 inline-block w-fit"
          >
            Request a conversation
          </Link>

          <Link
            href={routes.blog}
            className="text-base md:text-lg font-serif text-neutral-700 hover:text-neutral-900 transition-colors duration-300 border-b border-transparent hover:border-current pb-1 inline-block w-fit"
          >
            Blog articles
          </Link>

          <Link
            href="/locate"
            className="text-base md:text-lg font-serif text-neutral-700 hover:text-neutral-900 transition-colors duration-300 border-b border-transparent hover:border-current pb-1 inline-block w-fit"
          >
            Step back
          </Link>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-32" />
    </div>
  );
}
