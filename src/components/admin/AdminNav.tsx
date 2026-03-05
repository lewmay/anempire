'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import type { AdminUser } from '@/lib/auth/service';

export default function AdminNav({ user }: { user: AdminUser }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/submissions', label: 'Submissions' },
    { href: '/admin/blog', label: 'Blog' },
    ...(user.role === 'admin' ? [
      { href: '/admin/emails', label: 'Emails' },
      { href: '/admin/users', label: 'Users' },
      { href: '/admin/brand', label: 'Brand' },
    ] : []),
  ];

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors font-light">
              anEmpire
            </Link>

            <div className="flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-serif transition-colors ${
                    pathname === item.href
                      ? 'text-neutral-900 font-normal'
                      : 'text-neutral-600 hover:text-neutral-900 font-light'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-sans text-neutral-800">{user.email}</div>
              <div className="text-xs font-sans text-neutral-500">{user.role === 'admin' ? 'Admin' : 'System User'}</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-sans text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
