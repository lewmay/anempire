# Content Editing Guide

This guide explains how to edit all content on the anEmpire website without touching individual page components.

## Overview

All content is centralized in three locations:
1. **Page copy**: `/content/siteContent.ts`
2. **Navigation links**: `/content/routes.ts`
3. **Blog posts**: `/content/posts/` (MDX files)

## Editing Page Copy

**File**: `/content/siteContent.ts`

This file contains all text content for every page, organized by page and section.

### Structure

```typescript
export const siteContent = {
  global: {
    // Global elements like site name, blog link text
  },
  homepage: {
    // All homepage sections and links
  },
  pattern: {
    // Pattern page content
  },
  // ... other pages
}
```

### Example: Change Homepage Opening Text

Find the `homepage.sections` array and locate the `opening` section:

```typescript
{
  id: 'opening',
  text: 'Most marketing doesn\'t fail loudly.\n\nIt fades.',
}
```

Change the `text` value to update what appears on the homepage.

### Example: Change CTA Button Text

Find the specific page (e.g., `ask.form.submit`):

```typescript
ask: {
  form: {
    submit: 'Send question',  // ← Change this
  }
}
```

### Tips
- Use `\n` for line breaks within text
- Use `\n\n` for paragraph breaks
- Preserve the structure; only change values inside quotes
- Test after changes to ensure text displays correctly

---

## Editing Navigation Links

**File**: `/content/routes.ts`

All internal navigation paths are defined here. Change these to update URLs sitewide.

### Structure

```typescript
export const routes = {
  home: '/',
  pattern: '/pattern',
  blog: '/blog',
  blogArticle: (slug: string) => `/blog/${slug}`,
  // ... all routes
}
```

### Example: Change a URL

To change the "Save for Later" page URL from `/locate/save` to `/save-later`:

```typescript
save: '/save-later',  // Changed from '/locate/save'
```

**Important**: If you change a route, also update the corresponding folder structure in `/src/app/`.

---

## Editing Blog Posts

**Directory**: `/content/posts/`

Each blog post is an MDX file with frontmatter metadata.

### File Structure

```
/content/posts/
  ├── marketing-doesnt-fail-loudly.mdx
  ├── the-bridge-was-never-built.mdx
  ├── effort-has-a-ceiling.mdx
  └── ... other posts
```

### Frontmatter Fields

Every post must have this frontmatter at the top:

```yaml
---
title: "Article Title"
subtitle: "One-line descriptor"
year: "2024"
order: 1
status: "published"
slug: "article-url-slug"
---
```

#### Field Descriptions

- **title**: Article headline (appears in index and article page)
- **subtitle**: One-line descriptor (appears below title)
- **year**: Optional publication year
- **order**: Integer that determines sort order (1 = first, 2 = second, etc.)
- **status**: Either `"published"` or `"comingSoon"`
  - `"published"` = full article content is shown
  - `"comingSoon"` = shows placeholder "coming soon" message
- **slug**: URL-friendly identifier (must match filename without `.mdx`)

### Example: Create a New Blog Post

1. Create a new file: `/content/posts/my-new-article.mdx`

2. Add frontmatter and content:

```mdx
---
title: "My New Article"
subtitle: "A fresh perspective on growth"
year: "2024"
order: 6
status: "published"
slug: "my-new-article"
---

Your article content goes here.

Each paragraph should be separated by a blank line.

This makes it easy to read and edit.
```

3. The article will automatically appear in the blog index, sorted by the `order` field.

### Example: Reorder Blog Articles

Change the `order` values to rearrange articles:

```yaml
# Make "The Bridge Was Never Built" appear first
---
title: "The Bridge Was Never Built"
order: 1  # Changed from 2
status: "published"
---
```

```yaml
# Make "Marketing Doesn't Fail Loudly" appear second
---
title: "Marketing Doesn't Fail Loudly"
order: 2  # Changed from 1
status: "published"
---
```

### Example: Mark an Article as "Coming Soon"

Change the `status` field:

```yaml
---
title: "Future Article"
status: "comingSoon"  # Will show placeholder text
---
```

When ready to publish, change to:

```yaml
status: "published"
```

### Writing Article Content

After the frontmatter (`---`), write your article in plain text with Markdown formatting:

- **Paragraphs**: Separate with blank lines
- **Emphasis**: Use `*italic*` or `**bold**` if needed (keep it minimal)
- **Line breaks**: Use two spaces at end of line or `\` for manual breaks

---

## Testing Your Changes

After editing content:

1. Save the file
2. Restart the dev server if needed: `bun run dev`
3. Navigate to the page in your browser
4. Verify the changes appear correctly

---

## Common Tasks

### Change the site name globally
**File**: `/content/siteContent.ts`
```typescript
global: {
  siteName: 'anEmpire',  // ← Change this
}
```

### Change "Blog articles" link text
**File**: `/content/siteContent.ts`
```typescript
global: {
  blogLinkText: 'Blog articles',  // ← Change this
}
```

### Change the Thank You page message
**File**: `/content/siteContent.ts`
```typescript
thankYou: {
  title: 'That\'s enough for now.',  // ← Change this
  body: 'Clarity doesn\'t rush.\n\nIt accumulates.',  // ← Or this
}
```

### Add a new blog post
1. Create `/content/posts/new-post-slug.mdx`
2. Add frontmatter with `title`, `subtitle`, `year`, `order`, `status`, `slug`
3. Write content below frontmatter
4. Post appears automatically in blog index

### Remove a blog post from display
**Option 1**: Set status to `"comingSoon"`
**Option 2**: Delete or rename the `.mdx` file

---

## File Reference

| What to Edit | File Location |
|--------------|---------------|
| Page text/copy | `/content/siteContent.ts` |
| Navigation URLs | `/content/routes.ts` |
| Blog posts | `/content/posts/*.mdx` |
| Blog order | Change `order` field in MDX frontmatter |

---

## Need Help?

If you encounter issues:
1. Check syntax (missing quotes, commas, brackets)
2. Ensure MDX frontmatter is properly formatted
3. Verify file paths are correct
4. Restart dev server: `bun run dev`

For technical support, contact the development team.
