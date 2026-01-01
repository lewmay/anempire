import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import type { AdminUser } from '@/lib/auth/service';

interface AccessRestrictedProps {
  user: AdminUser;
}

export default function AccessRestricted({ user }: AccessRestrictedProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminNav user={user} />

      <div className="max-w-3xl mx-auto px-6 py-32">
        <div className="text-center space-y-8">
          <h1 className="text-3xl font-serif font-light text-neutral-800">
            Access restricted.
          </h1>

          <p className="text-lg font-serif font-light text-neutral-600">
            Your account does not have permission to view this page.
          </p>

          <div className="pt-8">
            <Link
              href="/admin"
              className="text-base font-serif font-light text-neutral-600 hover:text-neutral-900 transition-colors border-b border-transparent hover:border-current pb-1"
            >
              Back to admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
