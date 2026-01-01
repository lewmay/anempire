# Brand Assets Management - Quick Reference

**Version**: 96
**Status**: ✅ Complete & Production Ready
**Admin Access**: `/admin/brand` (Admin role only)

---

## What Was Built

Admin-only system to manage professional brand assets without code changes:
- Upload OG image, favicons, and app icons via web UI
- Professional Standards QA checks with pass/fail status
- All assets stored in `/public` for production compatibility
- Zero changes to public pages

---

## Asset Storage Location

**All uploads save to `/public` directory:**

```
/public/
├── og-image.png          ← Default social sharing image
├── favicon.ico           ← Browser tab icon (legacy)
├── favicon-16.png        ← 16×16 PNG favicon
├── favicon-32.png        ← 32×32 PNG favicon
├── apple-touch-icon.png  ← iOS bookmark icon
└── site.webmanifest      ← PWA manifest (auto-generated)
```

**Production-compatible**: Works on Netlify, Vercel, and all static hosts. No external storage needed.

---

## Admin Pages

**Brand Management** (`/admin/brand`):
- Display current NEXT_PUBLIC_BASE_URL (read-only)
- Upload OG image (1200×630 recommended)
- Upload favicon.ico
- Upload favicon-16.png (16×16)
- Upload favicon-32.png (32×32)
- Upload apple-touch-icon.png (180×180)
- Generate web manifest

**QA Checks** (`/admin/brand/check`):
- Automated pass/fail validation
- Checks for:
  - Base URL set and valid
  - OG image exists
  - All favicons exist
  - Web manifest exists
  - robots.txt blocks admin
  - sitemap.xml present
  - llms.txt present

**Navigation**: "Brand" link visible in admin nav (admin role only)

---

## How Assets Are Wired Sitewide

**Root Layout** (`src/app/layout.tsx`):
```tsx
export const metadata: Metadata = {
  // ... other metadata
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};
```

**Additional `<head>` tags**:
- `<meta name="theme-color" content="#262626">` (dark neutral)
- Manifest link for PWA support
- Apple touch icon for iOS bookmarks

**OG Image**:
- Already configured in `content/seo.ts` → `ogImage: '/og-image.png'`
- Used sitewide for social sharing via `lib/seo/metadata.ts`

---

## File Upload Specs

**OG Image**:
- Recommended: 1200×630
- Minimum: 400×300
- Formats: PNG, JPEG
- Max: 5MB

**Favicons**:
- favicon.ico: any size
- favicon-16.png: exactly 16×16
- favicon-32.png: exactly 32×32
- apple-touch-icon.png: exactly 180×180
- Formats: PNG, ICO
- Max: 5MB each

---

## API Endpoints (Admin-Only)

**Upload**: `POST /api/admin/brand/upload`
- Body: `FormData` with `file` and `type`
- Types: `og-image`, `favicon`, `favicon-16`, `favicon-32`, `apple-touch-icon`
- Returns: `{ success, filename, url, size }`

**Status**: `GET /api/admin/brand/status`
- Returns current existence status of all assets

**Generate Manifest**: `POST /api/admin/brand/generate-manifest`
- Creates `site.webmanifest` from uploaded icons

All endpoints require admin session authentication.

---

## Security

**Access Control**:
- ✅ All `/admin/brand/*` routes require admin role
- ✅ All API endpoints check session and role
- ✅ Unauthorized requests return 401

**Upload Validation**:
- ✅ Max 5MB per file
- ✅ File type validation (PNG, JPEG, ICO only)
- ✅ No arbitrary uploads
- ✅ Files saved to `/public` only

**No Public Exposure**:
- ✅ Brand management UI admin-only
- ✅ Upload endpoints not publicly accessible
- ✅ Assets served as static files (safe)

---

## Production Deployment Steps

**1. Upload Assets** (via `/admin/brand`):
- [ ] OG image (1200×630)
- [ ] favicon.ico
- [ ] favicon-16.png
- [ ] favicon-32.png
- [ ] apple-touch-icon.png
- [ ] Generate web manifest

**2. Set Environment Variable**:
- [ ] Set `NEXT_PUBLIC_BASE_URL=https://yourdomain.com`
- [ ] In deployment platform (Netlify, Vercel, etc.)
- [ ] Redeploy

**3. Run QA Checks** (`/admin/brand/check`):
- [ ] All checks pass (or only warnings)
- [ ] Base URL shows production domain

**4. Verify** (post-deployment):
- [ ] View page source, check `<link>` tags for favicon/manifest
- [ ] Test social sharing with [opengraph.xyz](https://www.opengraph.xyz/)
- [ ] Verify favicon in browser tab
- [ ] Test "Add to Home Screen" on iOS (optional)

---

## Files Created (8)

1. `lib/brand/assets.ts` - Asset utilities & QA checks
2. `src/app/admin/brand/page.tsx` - Brand management UI
3. `src/app/admin/brand/check/page.tsx` - QA checks page
4. `src/app/api/admin/brand/upload/route.ts` - Upload endpoint
5. `src/app/api/admin/brand/status/route.ts` - Status API
6. `src/app/api/admin/brand/generate-manifest/route.ts` - Manifest API

## Files Modified (2)

1. `src/components/admin/AdminNav.tsx` - Added "Brand" link
2. `src/app/layout.tsx` - Wired favicon, manifest, theme-color

---

## Zero Impact on Public Pages

**NOT Changed**:
- ✅ Zero public page layouts
- ✅ Zero public page designs
- ✅ Zero Global Setting 1 or 2 styles
- ✅ Zero copy changes
- ✅ Zero component changes
- ✅ Only `<head>` metadata + admin backend

**Linter**: ✅ Passing with zero errors

---

## Documentation

**Full Admin Guide**: `.same/brand-assets-management.md` (comprehensive)
**Todos**: `.same/todos.md` (implementation checklist)
**This Summary**: `.same/brand-assets-summary.md` (quick reference)

---

## Next Steps

**Ready for Use**:
1. Admin logs in to `/admin/brand`
2. Uploads brand assets
3. Runs QA checks
4. Sets production base URL
5. Deploys

**No code changes needed for asset updates** - all managed via admin UI.

---

**Created**: December 28, 2025
**Version**: 96
**Status**: ✅ Production Ready
