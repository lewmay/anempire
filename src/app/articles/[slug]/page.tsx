import { Metadata } from 'next';
import { getPostBySlug, getAllSlugs, getAllPosts } from '@/lib/blog';
import { generateArticleMetadata } from '@/lib/seo/metadata';
import StructuredData from '@/components/seo/StructuredData';
import { getBlogPostingSchema, getBreadcrumbSchema } from '@/lib/seo/structured-data';
import { routes } from '@/content/routes';
import ArticleClient from './article-client';

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  return generateArticleMetadata(post.title, post.subtitle, post.slug, post.year);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return null;
  }

  // Get all posts for the "Other articles" section
  const allPosts = getAllPosts();
  const otherArticles = allPosts.filter(p => p.slug !== slug);

  const breadcrumbs = [
    { name: 'Home', url: routes.home },
    { name: 'Articles', url: routes.blog },
    { name: post.title, url: routes.blogArticle(post.slug) },
  ];

  return (
    <>
      <StructuredData
        data={[
          getBlogPostingSchema(post.title, post.subtitle, post.slug, post.year),
          getBreadcrumbSchema(breadcrumbs),
        ]}
      />
      <ArticleClient post={post} otherArticles={otherArticles} />
    </>
  );
}
