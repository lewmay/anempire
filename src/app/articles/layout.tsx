import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { seoConfig } from '@/content/seo';
import { routes } from '@/content/routes';

export const metadata: Metadata = {
  ...generatePageMetadata({
    ...seoConfig.pages.blog,
    canonical: routes.blog,
  }),
  alternates: {
    types: {
      'application/rss+xml': `${seoConfig.site.url}/feed.xml`,
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
