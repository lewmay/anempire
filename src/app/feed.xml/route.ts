import { getAllPosts } from '@/lib/blog';
import { routes } from '@/content/routes';
import { seoConfig } from '@/content/seo';

export async function GET() {
  const baseUrl = seoConfig.site.url;
  const posts = getAllPosts().filter((post) => post.status === 'published');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${seoConfig.site.name} — Articles</title>
    <link>${baseUrl}${routes.blog}</link>
    <description>${seoConfig.pages.blog.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}${routes.blogArticle(post.slug)}</link>
      <description>${escapeXml(post.subtitle)}</description>
      <guid isPermaLink="true">${baseUrl}${routes.blogArticle(post.slug)}</guid>
      ${post.year ? `<pubDate>${new Date(parseInt(post.year), 0, 1).toUTCString()}</pubDate>` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}
