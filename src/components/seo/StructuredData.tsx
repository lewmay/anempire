import { JsonLd, renderJsonLd } from '@/lib/seo/structured-data';

interface StructuredDataProps {
  data: JsonLd | JsonLd[];
}

/**
 * Component to inject JSON-LD structured data into page head
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: renderJsonLd(data) }}
    />
  );
}
