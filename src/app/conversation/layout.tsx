import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { seoConfig } from '@/content/seo';
import { routes } from '@/content/routes';

export const metadata: Metadata = generatePageMetadata({
  ...seoConfig.pages.conversation,
  canonical: routes.conversation,
});

export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
