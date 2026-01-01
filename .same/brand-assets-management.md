# Brand Assets Management - Admin Guide

**Version**: 96
**Date**: December 28, 2025
**Status**: ✅ Production Ready

---

## Overview

The Brand Assets Management system allows administrators to upload and manage professional assets (OG images, favicons, app icons) without touching code. All assets are stored in `/public` and served as static files.

**Key Features**:
- Upload default Open Graph image for social sharing
- Upload complete favicon set (ICO + PNG variants)
- Upload Apple Touch Icon for iOS bookmarks
- Auto-generate web manifest for PWA support
- Run Professional Standards QA checks
- Zero code changes required for asset updates

---

## Access & Permissions

**Who Can Access**: Admin role only
**Location**: `/admin/brand` (visible in admin navigation)
**QA Checks**: `/admin/brand/check`

**Routes Protected**:
- `/admin/brand` - Brand management page
- `/admin/brand/check` - QA checks page
- `/api/admin/brand/*` - All API endpoints

**Authentication**: Session-based. Must be logged in as Admin role.

---

## Asset Types & Specifications

### 1. Open Graph Image

**Purpose**: Default social sharing preview image
**Filename**: `og-image.png`
**Location**: `/public/og-image.png`
**URL**: `https://yourdomain.com/og-image.png`

**Specifications**:
- **Recommended Size**: 1200×630 pixels
- **Minimum Size**: 400×300 pixels
- **Format**: PNG or JPEG
- **Max File Size**: 5MB
- **Used For**: Facebook, Twitter, LinkedIn, WhatsApp, Slack previews

**What Happens**:
- Replaces any existing `/public/og-image.png`
- Used sitewide for all pages without custom OG images
- Referenced in `<meta property="og:image">` and `<meta name="twitter:image">`

**Validation**:
- ✅ 1200×630 = Perfect dimensions
- ⚠️ Other sizes = Warning but accepted
- ❌ <400×300 = Rejected (too small)

---

### 2. Favicon (ICO)

**Purpose**: Browser tab icon (legacy support)
**Filename**: `favicon.ico`
**Location**: `/public/favicon.ico`
**URL**: `https://yourdomain.com/favicon.ico`

**Specifications**:
- **Size**: Any (typically 16×16 or 32×32)
- **Format**: ICO only
- **Max File Size**: 5MB
- **Used For**: Older browsers, fallback icon

**What Happens**:
- Replaces any existing `/public/favicon.ico`
- Loaded automatically by browsers at root
- Referenced in `<link rel="icon" href="/favicon.ico">`

---

### 3. Favicon 16×16 PNG

**Purpose**: Modern browser tab icon (16px)
**Filename**: `favicon-16.png`
**Location**: `/public/favicon-16.png`
**URL**: `https://yourdomain.com/favicon-16.png`

**Specifications**:
- **Required Size**: Exactly 16×16 pixels
- **Format**: PNG only
- **Max File Size**: 5MB
- **Used For**: Browser tabs (modern browsers)

**What Happens**:
- Replaces any existing `/public/favicon-16.png`
- Referenced in `<link rel="icon" sizes="16x16" type="image/png">`

**Validation**:
- ✅ 16×16 = Perfect
- ❌ Any other size = Rejected

---

### 4. Favicon 32×32 PNG

**Purpose**: Modern browser tab icon (32px, high-DPI)
**Filename**: `favicon-32.png`
**Location**: `/public/favicon-32.png`
**URL**: `https://yourdomain.com/favicon-32.png`

**Specifications**:
- **Required Size**: Exactly 32×32 pixels
- **Format**: PNG only
- **Max File Size**: 5MB
- **Used For**: High-DPI displays, bookmarks

**What Happens**:
- Replaces any existing `/public/favicon-32.png`
- Referenced in `<link rel="icon" sizes="32x32" type="image/png">`

**Validation**:
- ✅ 32×32 = Perfect
- ❌ Any other size = Rejected

---

### 5. Apple Touch Icon

**Purpose**: iOS home screen bookmark icon
**Filename**: `apple-touch-icon.png`
**Location**: `/public/apple-touch-icon.png`
**URL**: `https://yourdomain.com/apple-touch-icon.png`

**Specifications**:
- **Required Size**: Exactly 180×180 pixels
- **Format**: PNG only
- **Max File Size**: 5MB
- **Used For**: iOS "Add to Home Screen" bookmarks

**What Happens**:
- Replaces any existing `/public/apple-touch-icon.png`
- Referenced in `<link rel="apple-touch-icon">`
- Automatically rounded by iOS

**Validation**:
- ✅ 180×180 = Perfect
- ❌ Any other size = Rejected

---

### 6. Web Manifest

**Purpose**: PWA metadata (app name, icons, colors)
**Filename**: `site.webmanifest`
**Location**: `/public/site.webmanifest`
**URL**: `https://yourdomain.com/site.webmanifest`

**Specifications**:
- **Format**: JSON
- **Auto-Generated**: Yes
- **Used For**: Progressive Web App support, "Add to Home Screen"

**Contents**:
```json
{
  "name": "anEmpire",
  "short_name": "anEmpire",
  "description": "When marketing isn't designed to connect...",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fafafa",
  "theme_color": "#262626",
  "icons": [
    { "src": "/favicon-16.png", "sizes": "16x16", "type": "image/png" },
    { "src": "/favicon-32.png", "sizes": "32x32", "type": "image/png" },
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
  ]
}
```

**What Happens**:
- Generated on-demand via "Generate manifest" button
- References all uploaded favicon/app icons
- Enables mobile "Add to Home Screen" functionality

---

## How to Upload Assets

### Step-by-Step Upload Process

1. **Log in as Admin**
   - Visit `/admin/login`
   - Enter admin credentials

2. **Navigate to Brand Management**
   - Click "Brand" in admin navigation
   - Or visit `/admin/brand` directly

3. **Check Current Status**
   - Green boxes = Asset exists
   - No box = Asset missing

4. **Upload Assets**
   - Click "Choose File" for desired asset type
   - Select file from your computer
   - File uploads automatically on selection
   - Wait for "✓ Uploaded [filename]" confirmation

5. **Generate Manifest** (if needed)
   - Scroll to "Web Manifest" section
   - Click "Generate manifest" button
   - Manifest created using uploaded icons

6. **Run QA Checks**
   - Click "Run Professional Standards QA Checks →"
   - Review pass/fail/warning status
   - Address any failures before production

### Upload Feedback

**During Upload**:
- "Uploading..." message appears
- File input disabled until complete

**Success**:
- "✓ Uploaded [filename]" (green text)
- Status box turns green
- Message disappears after 3 seconds

**Error**:
- "✗ [Error message]" (red text)
- Common errors:
  - File too large (>5MB)
  - Wrong file type
  - Wrong dimensions (for strict size requirements)
  - Network error

---

## Professional Standards QA Checks

**Location**: `/admin/brand/check`
**Purpose**: Automated validation of production readiness

### Checks Performed

**1. Base URL**
- ✅ Pass: NEXT_PUBLIC_BASE_URL set and not localhost
- ⚠️ Warning: Using localhost (update for production)
- ⚠️ Warning: Not set in environment variables

**2. OG Image**
- ✅ Pass: `/og-image.png` exists
- ⚠️ Warning: Missing (upload via Brand management)

**3. Favicon ICO**
- ✅ Pass: `/favicon.ico` exists
- ⚠️ Warning: Missing

**4. Favicon PNGs**
- ✅ Pass: Both `/favicon-16.png` and `/favicon-32.png` exist
- ⚠️ Warning: One or both missing

**5. Apple Touch Icon**
- ✅ Pass: `/apple-touch-icon.png` exists
- ⚠️ Warning: Missing

**6. Web Manifest**
- ✅ Pass: `/site.webmanifest` exists
- ⚠️ Warning: Missing (can be auto-generated)

**7. robots.txt**
- ✅ Pass: Exists and blocks `/admin/*`
- ⚠️ Warning: Exists but may not block admin routes
- ❌ Fail: Missing

**8. sitemap.xml**
- ✅ Pass: Sitemap exists
- ⚠️ Warning: Not found (may be dynamically generated)

**9. llms.txt**
- ✅ Pass: AI/LLM optimization file exists
- ❌ Fail: Missing

**10. Public Page Indexing**
- ✅ Pass: Manual verification required

### Status Summary

**Pass Count**: Number of checks passed
**Warning Count**: Number of non-critical issues
**Fail Count**: Number of critical failures

### Recommendations

**If Failures Exist**:
- Address all failed checks before deploying to production
- Upload missing files via Brand management

**If Warnings Exist**:
- Review and upload missing assets
- Update NEXT_PUBLIC_BASE_URL in production

**Best Practices**:
- Test social sharing with [opengraph.xyz](https://www.opengraph.xyz/)
- Validate structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)
- Submit sitemap to Google Search Console after deployment

---

## Base URL Management

### Current Value Display

**What You See**:
- Current NEXT_PUBLIC_BASE_URL value
- Example: `https://anempire.com` or `http://localhost:3000`

**Warnings**:
- 🟡 Using localhost = Update for production
- 🔴 Not set = Must be set in environment variables

### How to Update Base URL

**This UI Cannot Change Environment Variables**

**For Production**:
1. Go to your deployment platform (Netlify, Vercel, etc.)
2. Open environment variables settings
3. Set `NEXT_PUBLIC_BASE_URL` to your production domain
4. Example: `https://anempire.com`
5. Redeploy application
6. Base URL will update automatically

**For Local Development**:
1. Open `.env.local` file in project root
2. Add or update: `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
3. Restart dev server
4. Base URL will update

### Copy Current Value

**Use Case**: Copy current URL to set in production
**How**:
1. Click "Copy current value" button
2. Value copied to clipboard
3. Paste into deployment platform settings

---

## Production Deployment Checklist

### Pre-Deployment

**Assets**:
- [ ] Upload OG image (1200×630)
- [ ] Upload favicon.ico
- [ ] Upload favicon-16.png (16×16)
- [ ] Upload favicon-32.png (32×32)
- [ ] Upload apple-touch-icon.png (180×180)
- [ ] Generate web manifest

**Environment**:
- [ ] Set NEXT_PUBLIC_BASE_URL to production domain
- [ ] Example: `https://anempire.com`

**QA Checks**:
- [ ] Run Professional Standards QA
- [ ] All checks pass or only warnings (no failures)
- [ ] Base URL shows production domain (not localhost)

### Post-Deployment

**Verification**:
- [ ] Visit homepage, view page source
- [ ] Verify `<link rel="icon" href="/favicon.ico">` present
- [ ] Verify `<link rel="apple-touch-icon">` present
- [ ] Verify `<link rel="manifest" href="/site.webmanifest">` present
- [ ] Verify `<meta property="og:image">` points to `/og-image.png`

**Testing**:
- [ ] Test social sharing preview (Facebook, Twitter, LinkedIn)
- [ ] Use [opengraph.xyz](https://www.opengraph.xyz/) to validate
- [ ] Check favicon appears in browser tab
- [ ] Test "Add to Home Screen" on iOS (if applicable)

**Search Console**:
- [ ] Submit sitemap to Google Search Console
- [ ] Validate structured data with Rich Results Test
- [ ] Monitor index coverage

---

## File Structure

```
public/
├── og-image.png          # Default OG image (uploaded via admin)
├── favicon.ico           # Main favicon (uploaded via admin)
├── favicon-16.png        # 16×16 PNG (uploaded via admin)
├── favicon-32.png        # 32×32 PNG (uploaded via admin)
├── apple-touch-icon.png  # iOS icon (uploaded via admin)
├── site.webmanifest      # Web app manifest (auto-generated)
├── robots.txt            # SEO robots file (code-managed)
├── llms.txt              # AI/LLM optimization (code-managed)
├── humans.txt            # Authorship file (code-managed)
└── content-map.txt       # Conceptual map (code-managed)
```

**Managed via Admin**:
- OG image, favicons, app icons, web manifest

**Managed via Code**:
- robots.txt, llms.txt, humans.txt, content-map.txt, sitemap.xml

---

## Troubleshooting

### Upload Failed: File Too Large

**Error**: "File too large. Maximum 5MB."
**Solution**:
- Compress image before upload
- Use online tools like [TinyPNG](https://tinypng.com/)
- Ensure dimensions don't exceed recommended size

### Upload Failed: Wrong Dimensions

**Error**: "Expected 16×16, got 32×32"
**Solution**:
- Resize image to exact required dimensions
- Use image editor (Photoshop, GIMP, Preview, etc.)
- Re-upload correctly sized file

### Upload Failed: Invalid File Type

**Error**: "Invalid file type"
**Solution**:
- Ensure file extension matches requirements
- OG image: PNG or JPEG only
- Favicons: PNG or ICO only
- Convert file if needed

### Asset Not Appearing on Site

**Check**:
1. Hard refresh browser (Cmd+Shift+R or Ctrl+F5)
2. Clear browser cache
3. Verify file uploaded successfully (green confirmation)
4. Check file exists at URL (e.g., `https://yourdomain.com/og-image.png`)
5. If using CDN, purge cache

### QA Check Fails: Base URL

**Issue**: "Using localhost URL"
**Solution**:
- Update NEXT_PUBLIC_BASE_URL in production environment
- Redeploy application
- Re-run QA checks to verify

---

## Technical Details

### Upload Endpoint

**URL**: `/api/admin/brand/upload`
**Method**: POST
**Auth**: Admin session required
**Body**: FormData with `file` and `type` fields

**Supported Types**:
- `og-image`
- `favicon`
- `favicon-16`
- `favicon-32`
- `apple-touch-icon`

**Response** (Success):
```json
{
  "success": true,
  "filename": "og-image.png",
  "url": "/og-image.png",
  "size": 123456
}
```

**Response** (Error):
```json
{
  "error": "File too large. Maximum 5MB."
}
```

### Status Endpoint

**URL**: `/api/admin/brand/status`
**Method**: GET
**Auth**: Admin session required

**Response**:
```json
{
  "baseUrl": "https://anempire.com",
  "ogImage": { "exists": true, "url": "/og-image.png" },
  "favicon": { "exists": true, "url": "/favicon.ico" },
  "favicon16": { "exists": true, "url": "/favicon-16.png" },
  "favicon32": { "exists": true, "url": "/favicon-32.png" },
  "appleTouchIcon": { "exists": true, "url": "/apple-touch-icon.png" },
  "manifest": { "exists": true, "url": "/site.webmanifest" }
}
```

### Manifest Generation Endpoint

**URL**: `/api/admin/brand/generate-manifest`
**Method**: POST
**Auth**: Admin session required

**Response**:
```json
{
  "success": true,
  "path": "/path/to/public/site.webmanifest"
}
```

---

## Security

**Admin-Only Access**:
- All `/admin/brand/*` routes require admin role
- All API endpoints check session and role
- Unauthorized requests return 401

**File Upload Validation**:
- Max 5MB per file
- File type validation (PNG, JPEG, ICO only)
- No arbitrary file uploads
- Files saved to `/public` only

**No Public Exposure**:
- Upload endpoints not publicly accessible
- Brand management UI only visible to admins
- Assets served as static files (no dynamic generation)

---

## Support & Contact

**Questions**: See admin dashboard or system status
**Deployment Issues**: Refer to deployment platform docs
**Code Issues**: Contact development team

---

**Last Updated**: December 28, 2025
**Version**: 96
**Status**: ✅ Production Ready
