# SEO & GEO/LLM Optimization Implementation

## Overview
Complete SEO and GEO/LLM optimization system for anEmpire, designed for maximum discoverability by both search engines and AI agents while maintaining the site's editorial philosophy.

## What's Been Implemented

### 1. Centralized Metadata System

**File:** `content/seo.ts`

Centralized configuration for:
- Site-wide defaults (name, URL, description, OG image)
- Organization information for structured data
- Page-specific metadata (title, description, OG tags)

All pages have unique:
- Title tags
- Meta descriptions
- Open Graph titles and descriptions
- Twitter Card data
- Canonical URLs

### 2. Metadata Utilities

**File:** `lib/seo/metadata.ts`

Functions:
- `generatePageMetadata()` - Creates Next.js Metadata objects
- `generateArticleMetadata()` - Specialized metadata for blog posts

Automatically includes:
- Canonical URLs
- Open Graph tags
- Twitter Cards
- Robot directives
- Image metadata

### 3. Structured Data (JSON-LD)

**File:** `lib/seo/structured-data.ts`

Implemented schemas:
- **Organization** - Site-wide organization data
- **WebSite** - Homepage website schema with search action
- **WebPage** - General page schema
- **BlogPosting** - Blog article schema with full metadata
- **BreadcrumbList** - Navigation breadcrumbs for blog

**Component:** `src/components/seo/StructuredData.tsx`
- Reusable component to inject JSON-LD into pages
- Used across homepage, blog posts, and key pages

### 4. Static SEO Files

**robots.txt** - `src/app/robots.ts`
- Allow all pages except /admin/ and /api/
- Includes sitemap reference
- Standard user-agent rules

**sitemap.xml** - `src/app/sitemap.ts`
- Auto-generated from page structure
- Includes all static pages with priorities
- Dynamically includes all published blog posts
- Proper change frequencies and last-modified dates
- Priorities:
  - Homepage: 1.0
  - Pattern pages: 0.9
  - Blog index: 0.8
  - Individual pages: 0.7-0.8

**RSS Feed** - `src/app/feed.xml/route.ts`
- Full RSS 2.0 feed for blog articles
- Only includes published posts
- Includes title, description, link, GUID
- Publication dates from post frontmatter
- Linked from blog index and blog layout
- Autodiscovery via `<link>` tags

### 5. GEO/LLM Optimization Files

**llms.txt** - `public/llms.txt`
Comprehensive guide for AI systems including:
- Overview of what anEmpire does
- Who the company serves
- Core concepts (The Pattern, Three Awarenesses, Outlier Shift)
- Key pages with descriptions
- Site structure and philosophy
- Content themes
- Contact information

**content-map.txt** - `public/content-map.txt`
Detailed concept map including:
- Key concepts with primary/secondary references
- Full page structure and purpose
- Internal linking strategy
- Site philosophy
- Target audience
- Conceptual architecture

**humans.txt** - `public/humans.txt`
- Team information
- Technology stack
- Design philosophy notes

### 6. Page-Level Metadata Implementation

All pages now have proper metadata via layouts:

**Homepage** (`src/app/page.tsx`)
- Server component wrapper with metadata export
- WebSite and WebPage JSON-LD schemas

**Pattern Page** (`src/app/pattern/layout.tsx`)
- Dedicated metadata for pattern explanation

**Locate Flow**
- `/locate` - Main locate page metadata
- `/locate/save` - Save for later metadata
- `/locate/thank-you` - Thank you page metadata
- `/locate/patterns` - Pattern explained metadata

**Action Pages**
- `/ask` - Ask a question metadata
- `/conversation` - Request conversation metadata

**Blog Section** (`src/app/blog/`)
- Blog index metadata with RSS autodiscovery
- Dynamic article metadata with BlogPosting schema
- Breadcrumb navigation schemas

### 7. Semantic HTML & Accessibility

All pages use proper semantic HTML:
- `<header>`, `<article>`, `<section>`, `<footer>` tags
- Proper heading hierarchy (H1 → H2)
- Descriptive link text
- ARIA labels where appropriate
- Focus states for interactive elements
- Skip-to-content capabilities

### 8. Internal Linking Strategy

Strong internal linking implemented:
- Pattern Explained links to Ask, Conversation, Blog
- Blog articles link back to Pattern Explained and index
- Homepage links to Pattern and Locate
- Clear navigation paths throughout
- Breadcrumbs on blog articles
- "Step back" links for user orientation

### 9. Performance & Crawlability

- Pages use Server Components where possible
- Blog posts are statically generated (SSG)
- All content is in HTML, not hidden behind JS
- Clean URL structure with no trailing slash inconsistencies
- Proper HTTP headers for caching
- RSS feed cached for 1 hour

## Files Created/Modified

### New Files
- `content/seo.ts` - SEO metadata configuration
- `lib/seo/metadata.ts` - Metadata generation utilities
- `lib/seo/structured-data.ts` - JSON-LD schema generators
- `src/components/seo/StructuredData.tsx` - JSON-LD component
- `src/app/robots.ts` - robots.txt generator
- `src/app/sitemap.ts` - sitemap.xml generator
- `src/app/feed.xml/route.ts` - RSS feed generator
- `public/llms.txt` - LLM optimization guide
- `public/content-map.txt` - Content architecture map
- `public/humans.txt` - Humans file
- Layout files for all major sections (8 layouts)

### Modified Files
- `src/app/layout.tsx` - Added global metadata and Organization schema
- `src/app/page.tsx` - Restructured for metadata export
- `src/app/home-client.tsx` - Homepage client component
- `src/app/blog/page.tsx` - Added RSS feed link
- `src/app/blog/[slug]/page.tsx` - Restructured for dynamic metadata
- `src/app/blog/[slug]/article-client.tsx` - Article client component
- `src/components/admin/EmailsClient.tsx` - Fixed linting issues
- `src/components/admin/SubmissionsClient.tsx` - Fixed linting issues

## SEO Checklist ✓

### Basics
- [x] Unique title per page
- [x] Unique meta description per page
- [x] Open Graph tags per page
- [x] Twitter Card tags per page
- [x] Canonical URLs
- [x] robots.txt
- [x] sitemap.xml
- [x] RSS feed
- [x] Clean URL structure
- [x] Proper H1/H2 hierarchy
- [x] Semantic HTML
- [x] Accessibility (ARIA labels, focus states)

### Structured Data
- [x] Organization schema
- [x] WebSite schema
- [x] WebPage schema for key pages
- [x] BlogPosting schema for articles
- [x] Breadcrumb schema for blog

### Performance/Crawlability
- [x] Server-side rendering where possible
- [x] Static generation for blog posts
- [x] All content in HTML
- [x] Image optimization ready
- [x] Proper caching headers

### GEO/LLM Optimization
- [x] llms.txt with site summary
- [x] content-map.txt with concept architecture
- [x] humans.txt
- [x] Strong internal linking
- [x] Clear conceptual structure

### Editorial Rules
- [x] Blog index uses manual ordering (not latest)
- [x] No category/tag pages
- [x] Conditional blog access maintained
- [x] Design philosophy preserved

## Testing Recommendations

1. **Structured Data Validation**
   - Test all JSON-LD with Google's Rich Results Test
   - Validate Organization schema
   - Validate BlogPosting schemas

2. **Meta Tags**
   - Check OG preview with Facebook Debugger
   - Check Twitter Card with Twitter Card Validator
   - Verify all canonical URLs are absolute

3. **Crawlability**
   - Test robots.txt: `curl https://anempire.com/robots.txt`
   - Test sitemap: `curl https://anempire.com/sitemap.xml`
   - Test RSS: `curl https://anempire.com/feed.xml`
   - Verify in Google Search Console

4. **LLM Readability**
   - Test llms.txt: `curl https://anempire.com/llms.txt`
   - Test content-map: `curl https://anempire.com/content-map.txt`

5. **Accessibility**
   - Run Lighthouse audit
   - Test keyboard navigation
   - Verify screen reader compatibility
   - Check color contrast ratios

## Deployment Checklist

Before deploying:
1. [ ] Update `NEXT_PUBLIC_BASE_URL` in environment variables
2. [ ] Create /public/og-image.png (1200x630)
3. [ ] Optionally create per-article OG images in /public/og-images/
4. [ ] Verify all internal links work
5. [ ] Test RSS feed renders correctly
6. [ ] Submit sitemap to Google Search Console
7. [ ] Submit sitemap to Bing Webmaster Tools
8. [ ] Monitor structured data in Search Console

## Maintenance

To add a new page:
1. Add page metadata to `content/seo.ts`
2. Create layout with metadata in page directory
3. Add page to sitemap if needed
4. Update internal linking where appropriate
5. Update content-map.txt if introducing new concepts

To add a new blog post:
1. Create MDX file in `content/posts/`
2. Set frontmatter (title, subtitle, year, order, status)
3. Metadata, sitemap, and RSS will auto-update

## Notes

- All existing page aesthetics preserved
- Global Setting 1/2 separation maintained
- No changes to user-facing functionality
- SEO layer sits cleanly on top of existing architecture
- Editorial philosophy enforced (manual blog ordering, no funnels)

## Next Steps

After deployment:
1. Monitor Search Console for indexing
2. Check structured data rich results
3. Monitor blog RSS subscriptions
4. Track LLM citation/references via analytics
5. A/B test OG images for social sharing
6. Consider adding author schema for blog posts
7. Consider adding FAQ schema for Pattern Explained page
