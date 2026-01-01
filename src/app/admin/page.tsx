import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth/service';
import { getDashboardStats } from '@/app/actions/admin';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminDashboardPage() {
  const user = await getSession();

  if (!user) {
    redirect('/admin/login');
  }

  const stats = await getDashboardStats();

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
                <td className="px-6 py-4 text-sm font-sans text-neutral-600 text-right">{stats.questions.total}</td>
                <td className="px-6 py-4 text-sm font-sans text-neutral-600 text-right">
                  {stats.questions.unreviewed > 0 ? (
                    <span className="text-red-600">{stats.questions.unreviewed}</span>
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
                <td className="px-6 py-4 text-sm font-sans text-neutral-600 text-right">{stats.conversations.total}</td>
                <td className="px-6 py-4 text-sm font-sans text-neutral-600 text-right">
                  {stats.conversations.unreviewed > 0 ? (
                    <span className="text-red-600">{stats.conversations.unreviewed}</span>
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
                <td className="px-6 py-4 text-sm font-sans text-neutral-600 text-right">{stats.saveForLater.total}</td>
                <td className="px-6 py-4 text-sm font-sans text-neutral-600 text-right">
                  {stats.saveForLater.unreviewed > 0 ? (
                    <span className="text-red-600">{stats.saveForLater.unreviewed}</span>
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
