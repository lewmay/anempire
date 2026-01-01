import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/service';
import AdminNav from '@/components/admin/AdminNav';
import BlogClient from '@/components/admin/BlogClient';

export default async function AdminBlogPage() {
  const user = await getSession();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminNav user={user} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-sans font-light text-neutral-800 mb-12">Blog</h1>

        <BlogClient />
      </div>
    </div>
  );
}
