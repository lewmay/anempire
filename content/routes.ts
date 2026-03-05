/**
 * Central Routes Registry
 * All internal navigation links are defined here.
 * Update these paths if you need to change URL structure.
 */

export const routes = {
  // Main pages
  home: '/',
  pattern: '/pattern',
  locate: '/locate',

  // Locate flow pages
  save: '/locate/save',
  thankYou: '/locate/thank-you',
  patternExplained: '/locate/patterns',

  // Action pages
  ask: '/ask',
  conversation: '/conversation',

  // Blog (Articles)
  blog: '/articles',
  articlesIndex: '/articles',
  blogArticle: (slug: string) => `/articles/${slug}`,
} as const;

export type Routes = typeof routes;
