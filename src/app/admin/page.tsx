'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'system_user';
  status: 'active' | 'disabled';
}

interface Stats {
  questions: { total: number; unreviewed: number };
  conversations: { total: number; unreviewed: number };
  saveForLater: { total: number; unreviewed: number };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/setup');
        const data = await res.json();
        
        if (data.user && data.user.status === 'active') {
          setUser(data.user);
          // Fetch stats
          const statsRes = await fetch('/api/admin/stats');
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData);
          }
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-600 font-sans">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminNav user={user} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-sans font-light text-neutral-800 mb-12">System status</h1>

        {/* Status Table */}
        <div className="bg-white border border-neutral-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-6 py-3 text-left text-sm font-sans text-neutral-600">Area</th>
                <th className="px-6 py-3 text-right text-sm font-sans text-neutral-600">Total</th>
                <th className="px-6 py-3 text-right text-sm font-sans text-neutral-600">Unreviewed</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-200">
                <td className="px-6 py-4 text-sm font-sans text-neutral-800">Questions</td>
                <td className="px-6 py-4 text-sm font-sans text-neutral-600 text-right">{stats?.questions.total || 0}</td>
                <td className="px-6 py-4 text-sm font-sans text-neutral-600 text-right">
                  {(stats?.questions.unreviewed || 0) > 0 ? (
                    <span className="text-red-600">{stats?.questions.unreviewed}</span>
                  ) : (
                    '0'
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href="/admin/submissions?type=questions"
                    className="text-sm font-sans text-neutral-600 hover:text-neutral-900"
                  >
                    View
                  </Link>
                </td>
              </tr>

              <tr className="border-b border-neutral-200">
                <td className="px-6 py-4 text-sm font-sans text-neutral-800">Conversations</td>
                <td className="px-6 py-4 text-sm font-sans text-neutral-600 text-right">{stats?.conversations.total || 0}</td>
                <td className="px-6 py-4 text-sm font-sans text-neutral-600 text-right">
                  {(stats?.conversations.unreviewed || 0) > 0 ? (
                    <span className="text-red-600">{stats?.conversations.unreviewed}</span>
                  ) : (
                    '0'
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href="/admin/submissions?type=conversations"
                    className="text-sm font-sans text-neutral-600 hover:text-neutral-900"
                  >
                    View
                  </Link>
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4 text-sm font-sans text-neutral-800">Save for Later</td>
                <td className="px-6 py-4 text-sm font-sans text-neutral-600 text-right">{stats?.saveForLater.total || 0}</td>
                <td className="px-6 py-4 text-sm font-sans text-neutral-600 text-right">
                  {(stats?.saveForLater.unreviewed || 0) > 0 ? (
                    <span className="text-red-600">{stats?.saveForLater.unreviewed}</span>
                  ) : (
                    '0'
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href="/admin/submissions?type=save-for-later"
                    className="text-sm font-sans text-neutral-600 hover:text-neutral-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
