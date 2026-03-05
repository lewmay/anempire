'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlobalSetting1Header from '@/components/GlobalSetting1Header';
import { submitConversation } from '@/app/actions/submissions';
import { grantBlogAccess } from '@/components/BlogLink';

export default function ConversationPage() {
  const router = useRouter();

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [role, setRole] = useState('');
  const [revenueModel, setRevenueModel] = useState('');
  const [revenueRange, setRevenueRange] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [limitation, setLimitation] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [willingness, setWillingness] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
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

    const result = await submitConversation({
      businessName,
      role,
      revenueModel,
      revenueRange,
      teamSize,
      limitation,
      responsibility,
      willingness,
      additionalContext: additionalContext || undefined,
    });

    if (result.success) {
      grantBlogAccess();
      router.push('/locate/thank-you?conversation=requested');
    } else {
      setError(result.error || 'Failed to submit conversation request');
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
          Request a Conversation
        </h1>

        {/* Opening body text */}
        <div className="space-y-8 mb-20">
          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-600">
            This is not an introduction call.
          </p>

          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-600">
            If you're here, you're likely past curiosity<br />
            and ready to take responsibility for changing how your business operates.
          </p>

          <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-600">
            This conversation is for owners who intend to move through the pattern,<br />
            not just talk about it.
          </p>
        </div>

        {/* Before you continue section */}
        <div className="mb-20 pt-12 border-t border-neutral-300">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-serif font-light text-neutral-700 mb-12">
            Before you continue
          </h2>

          <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600 mb-8">
            We work with owner-led firms where:
          </p>

          <ul className="space-y-4 mb-8">
            <li className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
              - Growth is required, not optional
            </li>
            <li className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
              - Decisions are acted on
            </li>
            <li className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
              - Responsibility can be delegated without losing control
            </li>
          </ul>

          <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
            If that doesn't describe where you are right now,<br />
            this probably isn't the right next step.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-20">
          {/* Business Information */}
          <div className="pt-12 border-t border-neutral-300">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-serif font-light text-neutral-700 mb-4">
              Business Information
            </h2>
            <p className="text-sm font-serif font-light text-neutral-400 mb-12">
              Please answer directly. Precision matters here.
            </p>

            <div className="space-y-10">
              {/* Business name */}
              <div>
                <label htmlFor="businessName" className="block text-base font-serif font-light text-neutral-600 mb-3">
                  Business name <span className="text-neutral-400">Required</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Your role */}
              <div>
                <label htmlFor="role" className="block text-base font-serif font-light text-neutral-600 mb-3">
                  Your role in the business <span className="text-neutral-400">Required</span>
                </label>
                <input
                  type="text"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Revenue model */}
              <div>
                <label htmlFor="revenueModel" className="block text-base font-serif font-light text-neutral-600 mb-3">
                  Primary revenue model <span className="text-neutral-400">Required</span>
                </label>
                <p className="text-sm font-serif font-light text-neutral-400 mb-3">
                  Service, project-based, retainer, mixed
                </p>
                <input
                  type="text"
                  id="revenueModel"
                  value={revenueModel}
                  onChange={(e) => setRevenueModel(e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Revenue range */}
              <div>
                <label htmlFor="revenueRange" className="block text-base font-serif font-light text-neutral-600 mb-3">
                  Current annual revenue range <span className="text-neutral-400">Required</span>
                </label>
                <select
                  id="revenueRange"
                  value={revenueRange}
                  onChange={(e) => setRevenueRange(e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors"
                >
                  <option value="">Select range</option>
                  <option value="under500k">Under $500k</option>
                  <option value="500k-1.5m">$500k–$1.5M</option>
                  <option value="1.5m-5m">$1.5M–$5M</option>
                  <option value="5m+">$5M+</option>
                </select>
              </div>

              {/* Team size */}
              <div>
                <label htmlFor="teamSize" className="block text-base font-serif font-light text-neutral-600 mb-3">
                  Number of people involved in delivery (including you) <span className="text-neutral-400">Required</span>
                </label>
                <input
                  type="text"
                  id="teamSize"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Qualifying Questions */}
          <div className="pt-12 border-t border-neutral-300">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-serif font-light text-neutral-700 mb-4">
              Qualifying Questions
            </h2>
            <p className="text-sm font-serif font-light text-neutral-400 mb-12">
              These determine whether a conversation makes sense.
            </p>

            <div className="space-y-10">
              {/* What's limiting growth */}
              <div>
                <label htmlFor="limitation" className="block text-base font-serif font-light text-neutral-600 mb-3">
                  What is currently limiting growth the most right now? <span className="text-neutral-400">Required</span>
                </label>
                <textarea
                  id="limitation"
                  value={limitation}
                  onChange={(e) => setLimitation(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-6 py-4 text-lg font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Who's responsible */}
              <div>
                <label htmlFor="responsibility" className="block text-base font-serif font-light text-neutral-600 mb-3">
                  When something breaks in your business, who is responsible for fixing it end-to-end? <span className="text-neutral-400">Required</span>
                </label>
                <textarea
                  id="responsibility"
                  value={responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-6 py-4 text-lg font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Willingness to change */}
              <div>
                <label htmlFor="willingness" className="block text-base font-serif font-light text-neutral-600 mb-3">
                  Are you willing to change how decisions are made and executed if it leads to sustained growth? <span className="text-neutral-400">Required</span>
                </label>
                <select
                  id="willingness"
                  value={willingness}
                  onChange={(e) => setWillingness(e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors"
                >
                  <option value="">Select answer</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="not-sure">Not sure yet</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional context */}
          <div className="pt-12 border-t border-neutral-300">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-serif font-light text-neutral-700 mb-8">
              Anything else we should know?
            </h2>
            <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600 mb-8">
              If there's context that matters, add it here.
            </p>
            <textarea
              id="additionalContext"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={6}
              className="w-full px-6 py-4 text-lg font-serif font-light text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* What happens next */}
          <div className="pt-12 border-t border-neutral-300">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-serif font-light text-neutral-700 mb-12">
              What happens next
            </h2>

            <div className="space-y-8 mb-16">
              <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
                We review every request.
              </p>

              <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
                If a conversation makes sense,<br />
                we'll reach out to schedule it.
              </p>

              <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
                If it doesn't,<br />
                we'll tell you directly.
              </p>

              <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed font-serif font-light text-neutral-600">
                No selling.<br />
                No convincing.<br />
                No follow-ups unless there's alignment.
              </p>
            </div>

            {/* Closing statement */}
            <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed font-serif font-light text-neutral-700 mb-16">
              This isn't about interest.<br />
              It's about intent.
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200">
                <p className="text-base font-serif text-red-700">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <div className="flex flex-col gap-8 items-start">
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-xl md:text-2xl text-neutral-700 hover:text-neutral-900 transition-colors duration-500 border-b border-transparent hover:border-current pb-1 font-serif font-light disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Request conversation'}
              </button>

              <Link
                href="/locate"
                className="text-base text-neutral-500 hover:text-neutral-700 transition-colors duration-500 border-b border-transparent hover:border-current pb-1 font-serif font-light"
              >
                Step back
              </Link>
            </div>
          </div>
        </form>

        {/* Bottom spacing */}
        <div className="h-32" />
      </div>
    </div>
  );
}
