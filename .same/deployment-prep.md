# anEmpire Deployment Preparation Guide

## 1. Overview

### What This Site Is
- **Public site**: Marketing pages, pattern explanation, blog articles, contact forms
- **Admin backend**: User management, submission review, email composer, blog content management

### Required Services
- **Database**: Supabase (PostgreSQL)
- **Email Provider**: Resend
- **Hosting**: Vercel/Netlify (Next.js compatible)

### Route Map

**Public Routes**
- `/` - Homepage
- `/pattern` - Follow the Pattern page
- `/locate` - Locate the Pattern page
- `/save` - Save for Later form
- `/ask` - Ask a Question form
- `/conversation` - Request a Conversation form
- `/thank-you` - Form submission confirmation
- `/blog` - Blog index (conditional access via localStorage flag)
- `/blog/[slug]` - Individual blog articles

**Admin Routes** (all protected)
- `/admin/login` - Admin login
- `/admin/forgot-password` - Password reset request
- `/admin/reset-password` - Password reset confirmation
- `/admin` - System status (dashboard)
- `/admin/submissions` - View all form submissions
- `/admin/emails` - Send emails to contacts (Admin role only)
- `/admin/users` - User management (Admin role only)
- `/admin/blog` - Blog post management (Admin and System User)

---

## 2. Environment Variables

### Required Variables

```bash
# Public URL (update for production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend
RESEND_API_KEY=re_your_api_key

# Admin Email (receives notifications)
ADMIN_EMAIL=admin@yourdomain.com

# Session Secret (generate random string)
SESSION_SECRET=your-random-secret-min-32-chars

# Initial Admin Password (production deployment)
# Auto-creates lewmay1@gmail.com on first /admin access
# Change password after first login, then optionally remove
INITIAL_ADMIN_PASSWORD=your-secure-initial-password
```

### Where to Get Keys

- **NEXT_PUBLIC_BASE_URL**: Your production domain (e.g., `https://anempire.com`)
- **Supabase keys**: Supabase Dashboard → Settings → API
- **RESEND_API_KEY**: Resend Dashboard → API Keys
- **ADMIN_EMAIL**: Your notification email address
- **SESSION_SECRET**: Generate with `openssl rand -base64 32`
- **INITIAL_ADMIN_PASSWORD**: Your chosen initial password (min 8 chars, change after first login)

### Example .env Template

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ADMIN_EMAIL=
SESSION_SECRET=
```

---

## 3. Database

### Database Choice
This project uses **PostgreSQL via Supabase**.

### Migration Approach
SQL schema executed directly in Supabase SQL Editor.

### Complete Migration SQL

Run this in Supabase SQL Editor:

```sql
-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'system_user' CHECK (role IN ('admin', 'system_user')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('ask', 'conversation', 'save')),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_by UUID REFERENCES admin_users(id),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent',
  error_message TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to submissions
DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Running Migrations

**Locally:**
1. Open Supabase Dashboard
2. Navigate to SQL Editor
3. Paste complete migration SQL
4. Click "Run"

**Production:**
Same process - Supabase uses one database for all environments. Use environment-specific projects if needed.

---

## 4. Create Initial Admin User

### Why This Matters
- Admin user required to access `/admin/*` routes
- First admin creates subsequent users
- No self-registration or public signup

### Method 1: Auto-Seed on Deploy (Recommended for Production)

**Automatic server-side seeding on first admin route access.**

**How it works:**
- When you first access any `/admin/*` route, the server checks if an admin exists
- If no admin exists and `INITIAL_ADMIN_PASSWORD` is set, it creates the admin user
- This happens automatically - no manual script needed
- Safe, idempotent, never blocks public pages

**Step 1: Set Initial Password in Production**

Add to your production environment variables:

```bash
INITIAL_ADMIN_PASSWORD=YourSecureInitialPassword123
```

**Important:**
- Password must be at least 8 characters
- This is your initial login password
- Change it immediately after first login
- Optionally remove this env var after password is changed

**Step 2: Deploy to Production**

Deploy your app normally:
```bash
# Build and deploy (example for Vercel/Netlify)
npm run build
```

**Step 3: First Login**

1. Navigate to `/admin/login` on your production domain
2. The server will automatically:
   - Check if any admin exists
   - Create admin user if needed (lewmay1@gmail.com)
   - Set password from INITIAL_ADMIN_PASSWORD
3. Log in with:
   - Email: `lewmay1@gmail.com`
   - Password: (your INITIAL_ADMIN_PASSWORD)
4. Should redirect to `/admin` dashboard

**Step 4: Change Password (REQUIRED)**

**Immediately after first login:**
1. Click "Logout" in top-right
2. Go to `/admin/login`
3. Click "Forgot password"
4. Enter: `lewmay1@gmail.com`
5. Check email for password reset link
6. Set new secure password
7. Log in with new password

**Step 5: Cleanup (Optional)**

After password is changed and reset flow verified:
1. Remove `INITIAL_ADMIN_PASSWORD` from production env vars
2. Redeploy (optional - server won't use it anymore)

**Safety Features:**
- ✅ Only runs on `/admin/*` routes (never on public pages)
- ✅ Checks if admin exists (won't create duplicates)
- ✅ Gracefully handles missing env vars
- ✅ Never blocks or crashes public pages
- ✅ Logs minimal information only
- ✅ One-time operation per server instance

**Error Handling:**
- If `INITIAL_ADMIN_PASSWORD` is missing: Server logs warning, login page still loads
- If database is down: Server logs error, login page still loads
- Public pages always work regardless of admin seed status

---

### Method 2: Bootstrap Script (Alternative for Development)

**Safe one-time bootstrap for first admin account.**

**Step 1: Set Bootstrap Password**

Add to `.env.local`:

```bash
# Temporary bootstrap password (remove after admin is created)
ADMIN_BOOTSTRAP_PASSWORD=your_secure_temporary_password
```

**Important:**
- Password must be at least 8 characters
- This is temporary - you'll change it after first login
- Remove this env var after bootstrap completes

**Step 2: Run Bootstrap Script**

```bash
cd anempire
bun run bootstrap
```

**Step 3: What Happens**

The script will:
- ✅ Check if admin user `lewmay1@gmail.com` already exists
- ✅ If not, create admin user with:
  - Email: `lewmay1@gmail.com`
  - Role: `admin`
  - Status: `active`
  - Password: (from ADMIN_BOOTSTRAP_PASSWORD)
- ✅ Print success message or "Admin already exists"

**Step 4: First Login**

1. Navigate to `/admin/login`
2. Enter:
   - Email: `lewmay1@gmail.com`
   - Password: (your ADMIN_BOOTSTRAP_PASSWORD)
3. Should redirect to `/admin` dashboard
4. **Immediately change your password** using the password reset flow

**Step 5: Cleanup**

After successful login:
1. Remove `ADMIN_BOOTSTRAP_PASSWORD` from `.env.local`
2. Change your password via `/admin/forgot-password`
3. Script is now safe to delete (or keep for other environments)

**Security:**
- ✅ Script only runs if password env var is set
- ✅ Script won't overwrite existing admin
- ✅ No public routes exposed
- ✅ No self-registration
- ✅ One-time use only

---

### Method 2: Interactive CLI Script (Alternative)

**For creating additional admin users manually.**

The project includes a user creation script at `/scripts/create-admin.ts`.

**Step-by-step:**

1. Ensure `.env.local` is configured with Supabase credentials
2. Run the script:

```bash
cd anempire
bun run scripts/create-admin.ts
```

3. Follow prompts to enter:
   - Email address
   - Password (min 8 characters)
   - Role (select 'admin')

4. Script will:
   - Hash password with bcrypt
   - Insert user into `admin_users` table
   - Return success confirmation

**Verify Login:**

1. Start dev server: `bun run dev`
2. Navigate to `http://localhost:3000/admin/login`
3. Enter email and password
4. Should redirect to `/admin` (System Status page)

**Alternative: Direct SQL Insert**

If script fails, use SQL (replace placeholders):

```sql
-- First, generate password hash in Node.js:
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('your-password', 10);
-- console.log(hash);

INSERT INTO admin_users (email, password_hash, role, status)
VALUES (
  'admin@yourdomain.com',
  '$2b$10$YOUR_HASHED_PASSWORD_HERE',
  'admin',
  'active'
);
```

---

## 5. Email Provider Setup

### Provider: Resend

**Configuration:**
1. Sign up at resend.com
2. Add and verify your domain
3. Generate API key
4. Add to `.env.local` as `RESEND_API_KEY`

**From Address:**
Update in `/lib/email.ts` if needed. Default: `noreply@yourdomain.com`

**Email Types Implemented:**

1. **Password Reset** - Sent when admin requests password reset
2. **New User Invite** - Sent when Admin creates new user (includes set password link)
3. **Save for Later Reminder** - Sent to users who save pattern for later
4. **Admin Notifications** - Sent to `ADMIN_EMAIL` on form submissions

**Verification Steps:**

1. Test password reset flow:
   - Go to `/admin/forgot-password`
   - Enter admin email
   - Check inbox for reset email
   - Click link, verify `/admin/reset-password` works

2. Test admin notifications:
   - Submit Ask a Question form
   - Check `ADMIN_EMAIL` inbox
   - Verify submission details received

3. Test save-for-later:
   - Submit Save for Later form
   - Check recipient inbox
   - Verify reminder email received

**DNS Configuration (High-Level):**

- **SPF**: Add TXT record provided by Resend
- **DKIM**: Add CNAME records provided by Resend
- **DMARC**: Add TXT record for domain authentication

Resend provides exact DNS records in dashboard under "Domains".

---

## 6. Security Checklist

### Route Protection
- [ ] All `/admin/*` routes check authentication via middleware
- [ ] Role-based access enforced server-side (not just UI hiding)
- [ ] `/admin/emails` restricted to Admin role only
- [ ] `/admin/users` restricted to Admin role only

### Access Control
- [ ] No public signup or registration
- [ ] Users can only be created by existing Admin
- [ ] Disabled users cannot log in
- [ ] Users cannot demote or disable themselves

### SEO/Crawling
- [ ] `/admin/*` routes excluded from sitemap
- [ ] `robots.txt` disallows `/admin`
- [ ] Login page has `noindex` meta tag

### Blog Access Flag
- [ ] Blog link only appears after triggering action (localStorage flag)
- [ ] Direct access to `/blog` without flag redirects to `/`
- [ ] Flag is client-side only (non-security-critical)

### Form Submission
- [ ] Server-side validation on all form endpoints
- [ ] Input sanitization for stored data
- [ ] Consider adding rate limiting (e.g., Vercel rate limit middleware)

### Session Management
- [ ] `SESSION_SECRET` is random and secure (min 32 chars)
- [ ] Session cookies are httpOnly (configured in auth service)
- [ ] Session expiry set appropriately (default 7 days)

### CSRF (if applicable)
- Next.js API routes with POST methods should validate origin headers
- Consider adding CSRF tokens for admin forms if deploying to high-risk environment

---

## 7. Testing Plan

### Pre-Launch Manual Checklist

**Forms:**
- [ ] Submit Ask a Question form
  - [ ] Verify data stored in `submissions` table (type: 'ask')
  - [ ] Verify admin notification email sent
  - [ ] Verify thank-you page displays correct message
  - [ ] Verify blog access flag set in localStorage

- [ ] Submit Request a Conversation form
  - [ ] Verify data stored in `submissions` table (type: 'conversation')
  - [ ] Verify admin notification email sent
  - [ ] Verify thank-you page displays correct message
  - [ ] Verify blog access flag set in localStorage

- [ ] Submit Save for Later form
  - [ ] Verify data stored in `submissions` table (type: 'save')
  - [ ] Verify reminder email sent to user
  - [ ] Verify admin notification email sent
  - [ ] Verify thank-you page displays correct message
  - [ ] Verify blog access flag set in localStorage

**Admin Authentication:**
- [ ] Login with admin credentials
- [ ] Login with system_user credentials
- [ ] Attempt login with disabled user (should fail)
- [ ] Attempt login with wrong password (should fail)
- [ ] Request password reset
- [ ] Complete password reset flow
- [ ] Logout and verify session cleared

**Admin Pages:**
- [ ] Admin: View system status
- [ ] Submissions: View all submissions
- [ ] Submissions: Filter by type
- [ ] Submissions: View submission details
- [ ] Emails: Send test email (Admin only)
- [ ] Emails: Verify email logged in `email_logs` table
- [ ] Users: Create new user (Admin only)
- [ ] Users: Verify new user receives invite email
- [ ] Users: Edit user role
- [ ] Users: Disable/enable user
- [ ] Users: Verify cannot self-demote or self-disable
- [ ] Blog: Edit blog post metadata
- [ ] Blog: Toggle published/comingSoon status
- [ ] Blog: Reorder posts

**Blog Access:**
- [ ] Clear localStorage
- [ ] Navigate to `/blog` directly (should redirect to `/`)
- [ ] Trigger flag (e.g., visit `/pattern`)
- [ ] Verify blog link appears in lower-right corner
- [ ] Navigate to `/blog` (should load)
- [ ] Verify post order matches admin settings
- [ ] Click article, verify rendering
- [ ] Verify "Coming soon" articles show placeholder

**SEO Outputs:**
- [ ] Verify `/sitemap.xml` loads
- [ ] Verify `/robots.txt` excludes `/admin`
- [ ] Verify `/rss.xml` loads (blog RSS)
- [ ] Verify `/llms.txt` loads
- [ ] Verify `/content-map.txt` loads

**Navigation:**
- [ ] Test all internal links
- [ ] Verify GlobalSetting1Header on all pages
- [ ] Verify no layout shift or content overlap with header
- [ ] Verify responsive behavior on mobile/tablet/desktop

### Suggested Test Data

**Test Admin User:**
- Email: `test-admin@yourdomain.com`
- Role: `admin`

**Test System User:**
- Email: `test-user@yourdomain.com`
- Role: `system_user`

**Test Submissions:**
- Ask question with short message
- Ask question with long message and contact info
- Request conversation with all fields filled
- Request conversation with minimal fields
- Save for later with future date

---

## 8. Production Deployment Steps

### Build Command
```bash
bun run build
```

### Deploy to Vercel (Recommended)

**Initial Setup:**
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure project:
   - Framework: Next.js
   - Build command: `bun run build`
   - Output directory: `.next`
   - Install command: `bun install`

**Environment Variables:**
1. In Vercel project settings → Environment Variables
2. Add all variables from `.env.local`
3. Update `NEXT_PUBLIC_BASE_URL` to production domain
4. Mark `NEXT_PUBLIC_*` as available to client

**Deploy:**
1. Push to main branch
2. Vercel auto-deploys
3. Monitor build logs

**Post-Deploy:**
1. Verify deployment URL loads
2. Check that environment variables are set (Vercel dashboard)
3. Run smoke tests (see below)

### Deploy to Netlify (Alternative)

**netlify.toml:**
```toml
[build]
  command = "bun run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Steps:**
1. Connect repository to Netlify
2. Set build command: `bun run build`
3. Set environment variables in Netlify dashboard
4. Deploy

### Running Migrations in Production

Supabase uses same database for all environments. If using separate Supabase projects:

1. Create production Supabase project
2. Run migration SQL in production SQL Editor
3. Update production environment variables with new Supabase URL/keys

### Smoke Tests Post-Deploy

1. Visit production URL
2. Verify homepage loads
3. Submit a test form
4. Check admin email for notification
5. Login to `/admin/login`
6. Verify submissions appear
7. Check production database for test data
8. Delete test submission

### Rollback Strategy

**Vercel:**
- Navigate to Deployments
- Find previous successful deployment
- Click "..." menu → Promote to Production

**Netlify:**
- Navigate to Deploys
- Find previous deploy
- Click "Publish deploy"

**Database Rollback:**
- Supabase does not auto-rollback
- For schema changes, manually revert SQL
- For data issues, restore from Supabase backup (if enabled)

---

## 9. Troubleshooting

### Common Issues

**1. Build fails with "Module not found"**
- Ensure all dependencies installed: `bun install`
- Check import paths match tsconfig path aliases
- Verify files exist at expected locations

**2. Admin login redirects to login page**
- Check `SESSION_SECRET` is set
- Verify Supabase credentials are correct
- Check browser cookies are enabled
- Inspect console for auth errors

**3. Emails not sending**
- Verify `RESEND_API_KEY` is correct
- Check Resend domain verification status
- Inspect Resend dashboard for failed sends
- Check spam folder

**4. Blog link not appearing**
- Verify localStorage flag is set (check browser DevTools → Application → Local Storage)
- Ensure trigger action completed (reached `/pattern` page, submitted form)
- Check `BlogLink` component is in root layout

**5. Forms not submitting**
- Check browser console for errors
- Verify API route is accessible (`/api/submit-ask`, etc.)
- Check Supabase service role key has write permissions
- Inspect network tab for 4xx/5xx responses

**6. Database connection failed**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `SUPABASE_SERVICE_ROLE_KEY` is correct
- Ensure Supabase project is not paused (free tier)
- Check IP restrictions in Supabase settings

**7. Role-based access not working**
- Verify user role in database matches expected ('admin' vs 'system_user')
- Check middleware is protecting routes
- Clear browser cache and cookies
- Re-login after role changes

**8. 404 on admin routes**
- Verify Next.js build completed successfully
- Check file structure: `/src/app/admin/*/page.tsx`
- Ensure dynamic routes have proper folder structure
- Restart dev server

**9. Styling issues in production**
- Check Tailwind config includes all content paths
- Verify production build includes all CSS
- Clear CDN cache if using one
- Check browser DevTools for missing CSS files

**10. Environment variables not available**
- `NEXT_PUBLIC_*` vars must be set at build time
- Rebuild after changing public env vars
- Server-side vars can be updated without rebuild
- Check deployment platform's env var UI

---

## Additional Notes

- **Backup strategy**: Enable Supabase automatic backups (Settings → Database → Backups)
- **Monitoring**: Set up Vercel Analytics or preferred monitoring tool
- **Error tracking**: Consider Sentry for production error logging
- **Performance**: Enable Next.js image optimization for any future images
- **Security updates**: Regularly update dependencies with `bun update`

---

**Last Updated**: December 2025
**Project**: anEmpire
**Framework**: Next.js 14+ (App Router)
**Runtime**: Bun
