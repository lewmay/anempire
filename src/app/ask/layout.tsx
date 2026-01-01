import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { seoConfig } from '@/content/seo';
import { routes } from '@/content/routes';

export const metadata: Metadata = generatePageMetadata({
  ...seoConfig.pages.ask,
  canonical: routes.ask,
});

export default function AskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
