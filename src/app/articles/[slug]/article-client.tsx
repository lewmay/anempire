'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GlobalSetting1Header from '@/components/GlobalSetting1Header';
import { Post } from '@/lib/blog';
import { routes } from '@/content/routes';
import { hasBlogAccess } from '@/components/BlogLink';

interface ArticleClientProps {
  post: Post;
  otherArticles: Post[];
}

export default function ArticleClient({ post, otherArticles }: ArticleClientProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Check access on mount
  useEffect(() => {
    if (!hasBlogAccess()) {
      router.push('/');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Show nothing while checking access
  if (isChecking) {
    return null;
  }

  // Split content into paragraphs
  const paragraphs = post.content.trim().split('\n\n');

  return (
    <div className="min-h-screen bg-[#f5f1eb] px-6 py-16">
      <GlobalSetting1Header />

      {/* Document Panel - starts below header */}
      <div
        className="max-w-2xl mx-auto bg-[#fdfcfa] px-12 md:px-20 py-16 md:py-24 mt-24"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.03)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      >
        {/* Article Header */}
        <header className="mb-16 pb-12 border-b border-neutral-300">
          <h1 className="text-3xl md:text-4xl font-serif font-normal text-neutral-900 mb-4 tracking-tight leading-tight">
            {post.title}
          </h1>
          <p className="text-base md:text-lg font-serif font-light text-neutral-600 mb-3 leading-relaxed">
            {post.subtitle}
          </p>
          {post.year && (
            <p className="text-sm font-serif font-light text-neutral-400">
              {post.year}
            </p>
          )}
        </header>

        {/* Article Body */}
        <article className="mb-20">
          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-base md:text-lg font-serif font-light text-neutral-700 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Other Articles Section */}
        <div className="mt-20 pt-12 border-t border-neutral-300">
          <h2 className="text-sm font-serif font-normal text-neutral-500 uppercase tracking-wide mb-8">
            Other articles
          </h2>

          <div className="space-y-6 mb-12">
            {otherArticles.map((item, index) => (
              <div key={item.slug}>
                <Link
                  href={routes.blogArticle(item.slug)}
                  className="block group"
                >
                  <p className="text-base md:text-lg font-serif font-normal text-neutral-800 group-hover:text-neutral-900 transition-colors leading-snug mb-1">
                    {index + 1}. {item.title}
                  </p>
                  <p className="text-sm md:text-base font-serif font-light text-neutral-600 leading-relaxed pl-5">
                    {item.subtitle}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <footer className="mt-16 pt-8 border-t border-neutral-300 flex flex-col gap-6">
          <Link
            href={routes.blog}
            className="text-base font-serif font-light text-neutral-600 hover:text-neutral-800 transition-colors duration-300 border-b border-transparent hover:border-current pb-0.5 inline-block w-fit"
          >
            Back to Articles
          </Link>

          <Link
            href={routes.home}
            className="text-base font-serif font-light text-neutral-600 hover:text-neutral-800 transition-colors duration-300 border-b border-transparent hover:border-current pb-0.5 inline-block w-fit"
          >
            Home
          </Link>
        </footer>
      </div>

      {/* Bottom spacing */}
      <div className="h-32" />
    </div>
  );
}
