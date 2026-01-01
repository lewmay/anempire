import Link from 'next/link';
import GlobalSetting1Header from '@/components/GlobalSetting1Header';
import { getAllPosts, Post } from '@/lib/blog';
import { siteContent } from '@/content/siteContent';
import { routes } from '@/content/routes';
import BlogAccessGuard from './BlogAccessGuard';

export default function BlogPage() {
  // Fetch articles on the server (safe to use fs module here)
  let articles: Post[] = [];
  try {
    articles = getAllPosts();
  } catch (error) {
    console.error('Failed to load blog posts:', error);
  }

  return (
    <BlogAccessGuard>
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
          {/* Page Title */}
          <header className="mb-16 pb-12 border-b border-neutral-300">
            <h1 className="text-3xl md:text-4xl font-serif font-normal text-neutral-900 mb-4 tracking-tight">
              {siteContent.blog.title}
            </h1>
            <p className="text-base md:text-lg font-serif font-light text-neutral-500 italic">
              {siteContent.blog.subtitle}
            </p>
          </header>

          {/* Article Listings */}
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-serif font-light text-neutral-600">
                No articles yet.
              </p>
            </div>
          ) : (
            <div className="space-y-12 mb-20">
              {articles.map((article) => (
                <article key={article.slug} className="group">
                  <Link
                    href={routes.blogArticle(article.slug)}
                    className="block space-y-2"
                  >
                    <h2 className="text-xl md:text-2xl font-serif font-normal text-neutral-800 group-hover:text-neutral-900 transition-colors leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-base font-serif font-light text-neutral-600 leading-relaxed">
                      {article.subtitle}
                    </p>
                    {article.year && (
                      <p className="text-sm font-serif font-light text-neutral-400 pt-1">
                        {article.year}
                      </p>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Navigation Links */}
          <footer className="mt-20 pt-12 border-t border-neutral-300 flex flex-col gap-6">
            <a
              href="/feed.xml"
              className="text-base font-serif font-light text-neutral-600 hover:text-neutral-800 transition-colors duration-300 border-b border-transparent hover:border-current pb-0.5 inline-block w-fit"
              rel="alternate"
              type="application/rss+xml"
            >
              RSS Feed
            </a>

            <Link
              href={routes.patternExplained}
              className="text-base font-serif font-light text-neutral-600 hover:text-neutral-800 transition-colors duration-300 border-b border-transparent hover:border-current pb-0.5 inline-block w-fit"
            >
              {siteContent.blog.links.backToPattern}
            </Link>

            <Link
              href={routes.home}
              className="text-base font-serif font-light text-neutral-600 hover:text-neutral-800 transition-colors duration-300 border-b border-transparent hover:border-current pb-0.5 inline-block w-fit"
            >
              {siteContent.blog.links.stepBack}
            </Link>
          </footer>
        </div>

        {/* Bottom spacing */}
        <div className="h-32" />
      </div>
    </BlogAccessGuard>
  );
}
