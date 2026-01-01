import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { seoConfig } from '@/content/seo';
import { routes } from '@/content/routes';
import StructuredData from '@/components/seo/StructuredData';
import { getWebPageSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = generatePageMetadata({
  ...seoConfig.pages.patternExplained,
  canonical: routes.patternExplained,
});

export default function PatternExplainedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData
        data={getWebPageSchema(
          seoConfig.pages.patternExplained.title,
          seoConfig.pages.patternExplained.description,
          routes.patternExplained
        )}
      />
      {children}
    </>
  );
}
