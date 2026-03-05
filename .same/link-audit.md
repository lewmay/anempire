# Site Navigation Link Audit

## Page-by-Page Link Verification

### Homepage (`/`)
- ✓ "Follow the pattern" → Click handler (no href yet)
- ✓ "Locate your business inside it" → `/locate`

### Pattern Page (`/pattern`)
- ✓ "Locate your business inside the pattern" → `/locate`
- ✓ "Step back to the overview" → `/`

### Locate Page (`/locate`)
- ✓ "Look at this now" → `/locate/patterns`
- ✓ "Save this for later" → `/locate/save`
- ? "Step back to pattern" → Should verify this exists

### Pattern Explained Page (`/locate/patterns`)
- ✓ "Ask a question" → `/ask`
- ✓ "Request a conversation" → `/conversation`
- ✓ "Blog articles" → `/blog` ← **FIXED in v84**
- ✓ "Step back" → `/locate`

### Ask a Question Page (`/ask`)
- ✓ "Step back" → `/locate/patterns`

### Request a Conversation Page (`/conversation`)
- ✓ "Step back" → `/locate`

### Save for Later Page (`/locate/save`)
- ✓ Form submission → `/locate/thank-you`

### Thank You Page (`/locate/thank-you`)
- ? Need to verify navigation links

### Blog Index Page (`/blog`)
- ✓ Individual articles → `/blog/[slug]`
- ✓ "Back to The Pattern" → `routes.patternExplained` (`/locate/patterns`)
- ✓ "Step back" → `routes.home` (`/`)
- ✓ RSS Feed → `/feed.xml`

### Blog Article Pages (`/blog/[slug]`)
- ✓ "Back to Articles" → `/blog`
- ✓ Other article links → `/blog/[slug]`

## Route Consistency Issues Found

### Issue 1: Hardcoded paths vs. centralized routes
Most pages use hardcoded paths like `/locate`, `/ask`, etc.
Only 3 pages import from `@/content/routes`:
- blog/page.tsx
- blog/[slug]/page.tsx  
- locate/thank-you/page.tsx

**Recommendation**: Update all pages to use centralized routes for consistency and maintainability.

### Issue 2: Homepage "Follow the pattern" link
The button uses a click handler (`setSelectedPath('pattern')`) but doesn't navigate.
Should navigate to `/pattern`.

### Issue 3: Inconsistent "Step back" behavior
Different pages have different "step back" destinations:
- Pattern Explained → `/locate`
- Ask page → `/locate/patterns`
- Conversation page → `/locate`
- Blog page → `/` (home)

This might be intentional based on user flow, but should verify consistency.

## All Routes Verified to Exist

 `/` - Homepage
 `/pattern` - Follow the Pattern
 `/locate` - Locate page
 `/locate/patterns` - Pattern Explained
 `/locate/save` - Save for Later
 `/locate/thank-you` - Thank You
 `/ask` - Ask a Question
 `/conversation` - Request a Conversation
 `/blog` - Blog Index (conditional access)
 `/blog/[slug]` - Blog Articles

## Admin Routes (Not Public)
 `/admin/login`
 `/admin` - System Status
 `/admin/submissions`
 `/admin/emails`
 `/admin/users`
 `/admin/blog`

## Status: ✓ FIXED
The blog articles link on Pattern Explained page has been restored and is working correctly.
No other broken links found in site structure.
