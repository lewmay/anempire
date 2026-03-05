import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { seoConfig } from '@/content/seo';
import { routes } from '@/content/routes';
import StructuredData from '@/components/seo/StructuredData';
import { getWebPageSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = generatePageMetadata({
  ...seoConfig.pages.pattern,
  canonical: routes.pattern,
});

export default function PatternLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData
        data={getWebPageSchema(
          seoConfig.pages.pattern.title,
          seoConfig.pages.pattern.description,
          routes.pattern
        )}
      />
      {children}
    </>
  );
}
