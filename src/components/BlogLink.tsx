'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { siteContent } from '@/content/siteContent';
import { routes } from '@/content/routes';

const BLOG_ACCESS_FLAG = 'anempire_engaged';
const BLOG_ACCESS_EXPIRY = 'anempire_engaged_expiry';

export default function BlogLink() {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check if flag exists and is not expired
    const flag = localStorage.getItem(BLOG_ACCESS_FLAG);
    const expiry = localStorage.getItem(BLOG_ACCESS_EXPIRY);

    if (flag === 'true' && expiry) {
      const expiryDate = new Date(expiry);
      const now = new Date();

      if (now < expiryDate) {
        setHasAccess(true);
      } else {
        // Clean up expired flag
        localStorage.removeItem(BLOG_ACCESS_FLAG);
        localStorage.removeItem(BLOG_ACCESS_EXPIRY);
      }
    }
  }, []);

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="fixed bottom-12 right-8 z-40">
      <Link
        href={routes.blog}
        className="text-sm font-serif font-light text-neutral-400 hover:text-neutral-600 transition-colors duration-500"
      >
        {siteContent.global.blogLinkText}
      </Link>
    </div>
  );
}

// Utility function to grant blog access with 30-day expiration
export function grantBlogAccess() {
  if (typeof window !== 'undefined') {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    localStorage.setItem(BLOG_ACCESS_FLAG, 'true');
    localStorage.setItem(BLOG_ACCESS_EXPIRY, expiryDate.toISOString());
  }
}

// Utility function to check if blog access is granted
export function hasBlogAccess(): boolean {
  if (typeof window === 'undefined') return false;

  const flag = localStorage.getItem(BLOG_ACCESS_FLAG);
  const expiry = localStorage.getItem(BLOG_ACCESS_EXPIRY);

  if (flag === 'true' && expiry) {
    const expiryDate = new Date(expiry);
    const now = new Date();

    if (now < expiryDate) {
      return true;
    } else {
      // Clean up expired flag
      localStorage.removeItem(BLOG_ACCESS_FLAG);
      localStorage.removeItem(BLOG_ACCESS_EXPIRY);
    }
  }

  return false;
}
