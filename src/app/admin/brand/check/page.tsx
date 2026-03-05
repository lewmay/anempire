import { runProfessionalStandardsChecks } from '@/lib/brand/assets';
import Link from 'next/link';

/**
 * Professional Standards QA Checks Page
 * Server component that runs validation checks
 */
export default function BrandCheckPage() {
  const checks = runProfessionalStandardsChecks();

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const failCount = checks.filter((c) => c.status === 'fail').length;
  const warningCount = checks.filter((c) => c.status === 'warning').length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-light text-neutral-900 mb-2">
          Professional Standards QA
        </h1>
        <p className="text-sm text-neutral-600 font-sans">
          Automated checks for production readiness
        </p>
      </div>

      {/* Summary */}
      <section className="mb-8 p-6 bg-neutral-50 border border-neutral-200 rounded">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-neutral-600 font-sans mb-1">Passed</p>
            <p className="text-2xl font-mono text-green-700">{passCount}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 font-sans mb-1">Warnings</p>
            <p className="text-2xl font-mono text-yellow-700">{warningCount}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 font-sans mb-1">Failed</p>
            <p className="text-2xl font-mono text-red-700">{failCount}</p>
          </div>
        </div>
      </section>

      {/* Checks List */}
      <section className="space-y-3">
        {checks.map((check, index) => (
          <div
            key={index}
            className={`p-4 border rounded ${
              check.status === 'pass'
                ? 'bg-green-50 border-green-200'
                : check.status === 'fail'
                ? 'bg-red-50 border-red-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p
                  className={`text-sm font-sans font-medium mb-1 ${
                    check.status === 'pass'
                      ? 'text-green-900'
                      : check.status === 'fail'
                      ? 'text-red-900'
                      : 'text-yellow-900'
                  }`}
                >
                  {check.name}
                </p>
                <p
                  className={`text-sm font-sans ${
                    check.status === 'pass'
                      ? 'text-green-700'
                      : check.status === 'fail'
                      ? 'text-red-700'
                      : 'text-yellow-700'
                  }`}
                >
                  {check.message}
                </p>
              </div>
              <span
                className={`text-lg ${
                  check.status === 'pass'
                    ? 'text-green-600'
                    : check.status === 'fail'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {check.status === 'pass' ? '✓' : check.status === 'fail' ? '✗' : '⚠'}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Recommendations */}
      {(failCount > 0 || warningCount > 0) && (
        <section className="mt-8 p-6 bg-neutral-50 border border-neutral-200 rounded">
          <h2 className="text-lg font-serif font-light text-neutral-900 mb-3">
            Recommendations
          </h2>
          <ul className="space-y-2 text-sm font-sans text-neutral-700">
            {failCount > 0 && (
              <li>
                • Address all failed checks before deploying to production
              </li>
            )}
            {warningCount > 0 && (
              <li>
                • Review warnings and upload missing assets via{' '}
                <Link
                  href="/admin/brand"
                  className="border-b border-neutral-300 hover:border-neutral-900"
                >
                  Brand management
                </Link>
              </li>
            )}
            <li>
              • Update NEXT_PUBLIC_BASE_URL in production environment variables
            </li>
            <li>
              • Test social sharing previews with{' '}
              <a
                href="https://www.opengraph.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-neutral-300 hover:border-neutral-900"
              >
                opengraph.xyz
              </a>
            </li>
            <li>
              • Validate structured data with{' '}
              <a
                href="https://search.google.com/test/rich-results"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-neutral-300 hover:border-neutral-900"
              >
                Google Rich Results Test
              </a>
            </li>
          </ul>
        </section>
      )}

      {/* Navigation */}
      <section className="mt-12 border-t border-neutral-200 pt-8 flex justify-between">
        <Link
          href="/admin/brand"
          className="text-base font-serif text-neutral-700 hover:text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 transition-colors"
        >
          ← Back to Brand management
        </Link>

        <Link
          href="/admin"
          className="text-base font-serif text-neutral-700 hover:text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 transition-colors"
        >
          Dashboard
        </Link>
      </section>
    </div>
  );
}
