'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlobalSetting1Header from '@/components/GlobalSetting1Header';
import { submitQuestion } from '@/app/actions/submissions';
import { grantBlogAccess } from '@/components/BlogLink';

export default function AskPage() {
  const router = useRouter();

  // Form state
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [debugMode, setDebugMode] = useState(false);

  // Debug mode: Show header boundary when ?debugHeader=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebugMode(params.get('debugHeader') === '1');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await submitQuestion({
      question,
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
    });

    if (result.success) {
      grantBlogAccess();
      router.push('/locate/thank-you?question=asked');
    } else {
      setError(result.error || 'Failed to submit question');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-20">
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

      {/* Main content - starts below header (h-24 = 96px) */}
      <div className="max-w-3xl mx-auto pt-32">
        {/* Title */}
        <h1 className="text-[clamp(2.5rem,5vw,4rem)] leading-tight font-serif font-light text-neutral-800 mb-20">
          Ask a Question
        </h1>

        {/* Opening body text */}
        <div className="space-y-8 mb-24">
          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-600">
            You don't need to be ready.<br />
            You don't need a plan.
          </p>

          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-600 pt-4">
            If something you just read landed,<br />
            but you're not sure what it means for your business yet,<br />
            this is where to ask.
          </p>
        </div>

        {/* What this is section */}
        <div className="mb-24 pt-12 border-t border-neutral-300">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-serif font-light text-neutral-700 mb-12">
            What this is
          </h2>

          <div className="space-y-8">
            <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
              A place to ask a real question.
            </p>

            <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
              Not a pitch.<br />
              Not a strategy session.<br />
              Not the start of a process.
            </p>

            <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600 pt-4">
              Just a way to surface something that feels unclear, stuck, or unfinished.
            </p>
          </div>
        </div>

        {/* Two ways to ask section */}
        <div className="mb-24 pt-12 border-t border-neutral-300">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-serif font-light text-neutral-700 mb-16">
            Two ways to ask
          </h2>

          {/* Option 1: Write it here */}
          <form onSubmit={handleSubmit} className="space-y-16">
            <div>
              <h3 className="text-[clamp(1.5rem,3vw,2rem)] leading-tight font-serif font-light text-neutral-700 mb-8">
                Write it here
              </h3>

              <div className="mb-12">
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  rows={10}
                  className="w-full px-6 py-5 text-lg font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors resize-none"
                  placeholder="What's the question?"
                />
              </div>

              {/* Optional contact fields */}
              <div className="space-y-8 pt-8">
                <p className="text-base font-serif font-light text-neutral-500">
                  Optional, only if you want a response:
                </p>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-serif font-light text-neutral-500 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-3 text-base font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-serif font-light text-neutral-500 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-3 text-base font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-serif font-light text-neutral-500 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-5 py-3 text-base font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2: Hotline */}
            <div className="pt-12 border-t border-neutral-300">
              <h3 className="text-[clamp(1.5rem,3vw,2rem)] leading-tight font-serif font-light text-neutral-700 mb-8">
                Or use the anEmpire Hotline
              </h3>

              <div className="space-y-8 mb-10">
                <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
                  Call or text your question.<br />
                  Leave a message.<br />
                  The line is not answered.
                </p>

                <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
                  No scripts.<br />
                  No pressure.<br />
                  No follow-up unless it's useful.
                </p>
              </div>

              <div className="bg-neutral-100 px-8 py-6 inline-block">
                <p className="text-2xl md:text-3xl font-serif font-light text-neutral-700 tracking-wide">
                  +1 (555) 000-0000
                </p>
              </div>
            </div>

            {/* What happens next section */}
            <div className="pt-16 border-t border-neutral-300">
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-serif font-light text-neutral-700 mb-12">
                What happens next
              </h2>

              <div className="space-y-8 mb-16">
                <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
                  We read and listen to everything.
                </p>

                <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
                  If there's a clear answer, we'll give it.<br />
                  If there isn't, we'll say so.<br />
                  If it makes sense to talk further, we'll let you know.
                </p>
              </div>

              {/* Closing statement */}
              <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-700 mb-16">
                You're not committing to anything.<br />
                This is just an opening.
              </p>

              {/* Error message */}
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200">
                  <p className="text-base font-serif text-red-700">{error}</p>
                </div>
              )}

              {/* Submit button and back link */}
              <div className="flex flex-col gap-8 items-start">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-xl md:text-2xl text-neutral-700 hover:text-neutral-900 transition-colors duration-500 border-b border-transparent hover:border-current pb-1 font-serif font-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send question'}
                </button>

                <Link
                  href="/locate/patterns"
                  className="text-base text-neutral-500 hover:text-neutral-700 transition-colors duration-500 border-b border-transparent hover:border-current pb-1 font-serif font-light"
                >
                  Step back
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Bottom spacing */}
        <div className="h-32" />
      </div>
    </div>
  );
}
