# Content Migration Status

## ✅ Completed

### Core Infrastructure
- [x] Central content file: `/content/siteContent.ts`
- [x] Routes registry: `/content/routes.ts`
- [x] Blog MDX system: `/content/posts/`
- [x] Blog utilities: `/lib/blog.ts`
- [x] TypeScript path aliases configured

### Pages Using Centralized Content
- [x] Blog Index (`/src/app/blog/page.tsx`)
  - Reads from MDX files
  - Uses `siteContent.blog` for page text
  - Uses `routes` for navigation

- [x] Blog Article Pages (`/src/app/blog/[slug]/page.tsx`)
  - Renders MDX content
  - Uses `routes` for navigation

- [x] Blog Link Component (`/src/components/BlogLink.tsx`)
  - Uses `siteContent.global.blogLinkText`
  - Uses `routes.blog`

---

## 🔄 Remaining Work

The following pages still have hardcoded content and need to be updated to use `/content/siteContent.ts` and `/content/routes.ts`:

### 1. Homepage (`/src/app/page.tsx`)
**Content to migrate:**
- All section text (opening, pattern, divider, structure, universal, observation, industries, question)
- Link labels ("Follow the pattern", "Locate your business inside it")
- Scroll indicator text ("scroll down")

**Current status:** Hardcoded
**Route usage:** Needs to use `routes.pattern` and `routes.locate`

---

### 2. Pattern Page (`/src/app/pattern/page.tsx`)
**Content to migrate:**
- Opening text
- All section paragraphs
- Final question
- Link labels

**Current status:** Hardcoded
**Route usage:** Needs to use `routes.locate` and `routes.home`

---

### 3. Locate Page (`/src/app/locate/page.tsx`)
**Content to migrate:**
- Title
- Explanation paragraphs
- Alternative text
- Reassurance text
- Link labels

**Current status:** Hardcoded
**Route usage:** Needs to use `routes.patternExplained` and `routes.save`

---

### 4. Save for Later Page (`/src/app/locate/save/page.tsx`)
**Content to migrate:**
- Title
- Explanation
- Form labels and helpers
- Button text
- "No thanks" option text

**Current status:** Hardcoded
**Route usage:** Needs to use `routes.thankYou`

---

### 5. Thank You Page (`/src/app/locate/thank-you/page.tsx`)
**Content to migrate:**
- Title
- Body text
- Closing text
- Link label

**Current status:** Hardcoded
**Route usage:** Needs to use `routes.home`

---

### 6. Ask a Question Page (`/src/app/ask/page.tsx`)
**Content to migrate:**
- Title
- Opening text
- "What this is" section
- Form labels and helpers
- Hotline section (title, description, number, note)
- "What happens next" section
- Closing statement
- Link labels

**Current status:** Hardcoded
**Route usage:** Needs to use `routes.locate` and `routes.thankYou`

---

### 7. Request Conversation Page (`/src/app/conversation/page.tsx`)
**Content to migrate:**
- Title
- Opening text
- "Before you continue" section (title, criteria list, closing)
- Form labels (all business info and qualifying questions)
- "What happens next" section
- Closing statement
- Link labels

**Current status:** Hardcoded
**Route usage:** Needs to use `routes.locate` and `routes.thankYou`

---

### 8. Pattern Explained Page (`/src/app/locate/patterns/page.tsx`)
**Content to migrate:**
- Title and subtitle
- Opening text
- All three awareness sections (titles, subtitles, content arrays)
- Closing section (title and content)
- Link labels

**Current status:** Hardcoded
**Route usage:** Needs to use `routes.locate`, `routes.conversation`, and `routes.ask`

---

## Migration Template

For each page, follow this pattern:

1. Import centralized content:
```typescript
import { siteContent } from '@/content/siteContent';
import { routes } from '@/content/routes';
```

2. Replace hardcoded strings with references:
```typescript
// Before:
<h1>Page Title</h1>

// After:
<h1>{siteContent.pageName.title}</h1>
```

3. Replace hardcoded routes with registry:
```typescript
// Before:
<Link href="/locate">Go</Link>

// After:
<Link href={routes.locate}>Go</Link>
```

---

## Benefits After Full Migration

Once all pages are migrated:
- ✅ Edit all copy from one file
- ✅ Change URLs sitewide instantly
- ✅ No need to search through components
- ✅ Easier for non-developers to update content
- ✅ Consistent terminology across site
- ✅ Deployment-ready content management

---

## Next Steps

To complete the migration:
1. Update homepage to use `siteContent.homepage`
2. Update pattern page to use `siteContent.pattern`
3. Update locate page to use `siteContent.locate`
4. Update save page to use `siteContent.save`
5. Update thank-you page to use `siteContent.thankYou`
6. Update ask page to use `siteContent.ask`
7. Update conversation page to use `siteContent.conversation`
8. Update pattern-explained page to use `siteContent.patternExplained`
9. Test all pages to ensure content displays correctly
10. Update this document to mark completed pages

---

## Current State

**System Status:** ✅ Functional
**Blog System:** ✅ Complete
**Other Pages:** ⚠️ Need migration

All content is already defined in `/content/siteContent.ts` and ready to use. The migration is straightforward but requires careful attention to ensure no content is lost during the transition.
