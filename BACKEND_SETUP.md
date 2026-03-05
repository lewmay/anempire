# Backend Setup Guide

## Prerequisites

- Bun installed
- Supabase account
- Resend account

## 1. Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and keys
4. Go to the SQL Editor and run the schema from `lib/db/schema.sql`

## 2. Email Setup (Resend)

1. Create an account at [resend.com](https://resend.com)
2. Go to API Keys and create a new key
3. Add and verify your sending domain

## 3. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your environment variables:

   ```env
   # Database Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Email Configuration
   RESEND_API_KEY=re_your_api_key
   EMAIL_FROM=noreply@yourdomain.com
   ADMIN_NOTIFY_EMAIL=admin@yourdomain.com

   # Application Configuration
   BASE_URL=http://localhost:3000
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # Authentication
   JWT_SECRET=generate_random_secret_here
   COOKIE_SECRET=generate_random_secret_here

   # Admin Setup
   INITIAL_ADMIN_EMAIL=admin@yourdomain.com
   ```

3. Generate secure secrets:
   ```bash
   # For JWT_SECRET and COOKIE_SECRET
   openssl rand -base64 32
   ```

## 4. Create Initial Admin User

Run this script in your Supabase SQL Editor or use the Supabase client:

```sql
-- Replace with your email and a temporary password
-- Password will be hashed automatically through the API
```

Or use this Node script:

```javascript
// scripts/create-admin.js
import { createAdminUser } from './lib/auth/service';

async function main() {
  const email = 'admin@yourdomain.com';
  const password = 'temporary-password-123'; // Change this!
  const name = 'Admin';

  const result = await createAdminUser(email, password, name);

  if (result.success) {
    console.log('Admin user created successfully');
    console.log('Please change your password after first login');
  } else {
    console.error('Failed to create admin user:', result.error);
  }
}

main();
```

Run it with:
```bash
bun run scripts/create-admin.js
```

## 5. Test the Setup

1. Start the development server:
   ```bash
   bun run dev
   ```

2. Go to `http://localhost:3000/admin/login`

3. Log in with your admin credentials

4. You should be able to:
   - View the dashboard
   - See submissions (once forms are submitted)
   - Send emails

## Form Endpoints

The following forms are connected to the backend:

- `/ask` - Question submissions
- `/conversation` - Conversation requests
- `/locate/save` - Save for later emails

All submissions are:
- Saved to the database
- Email notifications sent to admin
- User emails sent (for Save for Later)

## Admin Features

### Dashboard (`/admin`)
- Overview of all submissions
- Quick stats and links

### Submissions (`/admin/submissions`)
- View all questions, conversation requests, and save-for-later emails
- Mark submissions as reviewed
- Add notes to submissions
- Export to CSV

### Emails (`/admin/emails`)
- Send manual emails to Save for Later subscribers
- View email sending logs
- Track delivery success/failure

## Security Notes

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Change default passwords** immediately after first login
3. **Use strong secrets** for JWT and cookies
4. **Keep service role key** secure - it has full database access
5. **Verify email domain** in Resend before sending

## Troubleshooting

### Forms not submitting
- Check browser console for errors
- Verify environment variables are set
- Check Supabase connection

### Emails not sending
- Verify Resend API key is correct
- Check email domain is verified in Resend
- View email logs in admin panel for error messages

### Cannot login to admin
- Verify admin user was created in database
- Check JWT_SECRET is set in `.env.local`
- Try password reset flow

### Database errors
- Ensure schema was run in Supabase SQL Editor
- Check service role key has correct permissions
- Verify table names match schema
