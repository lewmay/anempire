import { Metadata } from 'next';
import { ReactNode } from 'react';
import { ensureInitialAdmin } from '@/lib/auth/seed';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Auto-seed initial admin user on first admin route access
  // This runs server-side and never blocks rendering
  await ensureInitialAdmin();

  return <>{children}</>;
}
