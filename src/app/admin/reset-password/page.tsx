'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/app/actions/auth';

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/admin/login');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    setIsSubmitting(true);

    const result = await resetPassword(token, newPassword);

    if (result.success) {
      router.push('/admin/login?reset=success');
    } else {
      setError(result.error || 'Failed to reset password');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-sans font-light text-neutral-800 mb-12">Set password</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}

          <div>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-4 py-3 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
            />
            <p className="text-xs font-sans text-neutral-500 mt-2">Minimum 8 characters</p>
          </div>

          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 text-base font-sans text-white bg-neutral-800 hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Setting...' : 'Set password'}
          </button>

          <Link
            href="/admin/login"
            className="block text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
          >
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
}
