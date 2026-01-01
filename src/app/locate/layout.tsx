import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { seoConfig } from '@/content/seo';
import { routes } from '@/content/routes';

export const metadata: Metadata = generatePageMetadata({
  ...seoConfig.pages.locate,
  canonical: routes.locate,
});

export default function LocateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
