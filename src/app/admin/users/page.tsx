import { redirect } from 'next/navigation';
import { getSession, isAdmin } from '@/lib/auth/service';
import AdminNav from '@/components/admin/AdminNav';
import UsersClient from '@/components/admin/UsersClient';
import AccessRestricted from '@/components/admin/AccessRestricted';

export default async function AdminUsersPage() {
  const user = await getSession();

  if (!user) {
    redirect('/admin/login');
  }

  if (!isAdmin(user)) {
    return <AccessRestricted user={user} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminNav user={user} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-sans font-light text-neutral-800 mb-12">Users</h1>

        <UsersClient />
      </div>
    </div>
  );
}
