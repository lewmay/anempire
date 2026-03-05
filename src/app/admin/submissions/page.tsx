'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import SubmissionsClient from '@/components/admin/SubmissionsClient';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'system_user';
  status: 'active' | 'disabled';
}

export default function SubmissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const type = searchParams.get('type') || 'questions';

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/setup');
        const data = await res.json();
        
        if (data.user && data.user.status === 'active') {
          setUser(data.user);
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
        <h1 className="text-2xl font-sans font-light text-neutral-800 mb-12">Submissions</h1>

        <SubmissionsClient initialType={type} />
      </div>
    </div>
  );
}
