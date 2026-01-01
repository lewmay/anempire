import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/service';
import AdminNav from '@/components/admin/AdminNav';
import SubmissionsClient from '@/components/admin/SubmissionsClient';

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const user = await getSession();

  if (!user) {
    redirect('/admin/login');
  }

  const params = await searchParams;
  const type = params.type || 'questions';

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminNav user={user} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-sans font-light text-neutral-800 mb-12">Submissions</h1>

        <SubmissionsClient initialType={type} />
      </div>
    </div>
  );
}
