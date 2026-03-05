import { seoConfig } from '@/content/seo';

/**
 * JSON-LD Structured Data Generators
 * These functions generate schema.org markup for SEO and rich results
 */

export interface JsonLd {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

/**
 * Organization schema for the site
 */
export function getOrganizationSchema(): JsonLd {
  const { organization, site } = seoConfig;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organization.name,
    legalName: organization.legalName,
    url: organization.url,
    description: organization.description,
    email: organization.email,
    // Add more fields as needed:
    // logo: `${site.url}/logo.png`,
    // address: { ... },
    // sameAs: ['https://twitter.com/...', 'https://linkedin.com/...'],
  };
}

/**
 * WebSite schema for the homepage
 */
export function getWebSiteSchema(): JsonLd {
  const { site } = seoConfig;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: {
      '@type': 'Organization',
      name: seoConfig.organization.name,
    },
  };
}

/**
 * WebPage schema for general pages
 */
export function getWebPageSchema(
  title: string,
  description: string,
  url: string
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${seoConfig.site.url}${url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: seoConfig.site.name,
      url: seoConfig.site.url,
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.organization.name,
    },
  };
}

/**
 * BlogPosting schema for blog articles
 */
export function getBlogPostingSchema(
  title: string,
  subtitle: string,
  slug: string,
  year?: string,
  modifiedYear?: string
): JsonLd {
  const url = `${seoConfig.site.url}/articles/${slug}`;
  const publishedDate = year ? `${year}-01-01T00:00:00.000Z` : new Date().toISOString();
  const modifiedDate = modifiedYear
    ? `${modifiedYear}-01-01T00:00:00.000Z`
    : publishedDate;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: subtitle,
    url,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Organization',
      name: seoConfig.organization.name,
      url: seoConfig.site.url,
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.organization.name,
      url: seoConfig.site.url,
      // logo: {
      //   '@type': 'ImageObject',
      //   url: `${seoConfig.site.url}/logo.png`,
      // },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: ['growth', 'structure', 'marketing', 'owner-led business'],
    articleSection: 'Business Strategy',
  };
}

/**
 * Breadcrumb schema for navigation
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${seoConfig.site.url}${item.url}`,
    })),
  };
}

/**
 * Helper to render JSON-LD script tag
 */
export function renderJsonLd(data: JsonLd | JsonLd[]): string {
  const jsonLdData = Array.isArray(data) ? data : [data];
  return JSON.stringify(jsonLdData.length === 1 ? jsonLdData[0] : jsonLdData);
}
