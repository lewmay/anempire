import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { seoConfig } from '@/content/seo';
import { routes } from '@/content/routes';

export const metadata: Metadata = generatePageMetadata({
  ...seoConfig.pages.save,
  canonical: routes.save,
});

export default function SaveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
