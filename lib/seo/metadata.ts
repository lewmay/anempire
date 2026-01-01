import { Metadata } from 'next';
import { seoConfig } from '@/content/seo';

interface PageMetadataOptions {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

/**
 * Generate Next.js Metadata object for a page
 */
export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    ogTitle = title,
    ogDescription = description,
    ogImage = seoConfig.site.ogImage,
    canonical,
    noindex = false,
  } = options;

  const baseUrl = seoConfig.site.url;
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : undefined;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return {
    title,
    description,
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: seoConfig.site.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
      creator: seoConfig.site.twitterHandle,
    },
  };
}

/**
 * Generate metadata for blog article
 */
export function generateArticleMetadata(
  title: string,
  subtitle: string,
  slug: string,
  year?: string
): Metadata {
  const fullTitle = `${title} — anEmpire`;
  const description = subtitle;
  const canonical = `/blog/${slug}`;
  const ogImage = `/og-images/${slug}.png`; // Could generate these per-article

  return {
    ...generatePageMetadata({
      title: fullTitle,
      description,
      ogTitle: title,
      ogDescription: subtitle,
      ogImage,
      canonical,
    }),
    openGraph: {
      ...generatePageMetadata({
        title: fullTitle,
        description,
        ogTitle: title,
        ogDescription: subtitle,
        ogImage,
        canonical,
      }).openGraph,
      type: 'article',
      publishedTime: year ? `${year}-01-01T00:00:00.000Z` : undefined,
      authors: ['anEmpire'],
      section: 'Business Strategy',
      tags: ['growth', 'structure', 'marketing', 'owner-led business'],
    },
  };
}
