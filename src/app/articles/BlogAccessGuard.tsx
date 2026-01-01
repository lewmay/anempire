'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasBlogAccess } from '@/components/BlogLink';

interface BlogAccessGuardProps {
  children: React.ReactNode;
}

export default function BlogAccessGuard({ children }: BlogAccessGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check access only once on mount
    const access = hasBlogAccess();

    if (!access) {
      // Redirect to home if no access
      router.push('/');
    } else {
      setHasAccess(true);
      setIsChecking(false);
    }
  }, [router]);

  // Show nothing while checking access or if no access
  if (isChecking || !hasAccess) {
    return null;
  }

  // Render children if access granted
  return <>{children}</>;
}
