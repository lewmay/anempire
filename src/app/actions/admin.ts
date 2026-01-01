'use server';

import { getServiceClient } from '@/lib/db/client';
import { getSession, isAdmin, hashPassword } from '@/lib/auth/service';
import { sendEmail } from '@/lib/email/service';
import { manualEmail, passwordResetEmail } from '@/lib/email/templates';

// Check if user is authenticated
async function requireAuth() {
  const user = await getSession();
  if (!user) {
    throw new Error('Unauthorized');
  }
  if (user.status !== 'active') {
    throw new Error('Access restricted');
  }
  return user;
}

// Check if user is admin
async function requireAdmin() {
  const user = await requireAuth();
  if (!isAdmin(user)) {
    throw new Error('Access restricted');
  }
  return user;
}

// Get dashboard stats
export async function getDashboardStats() {
  await requireAuth();
  const supabase = getServiceClient();

  const [questions, conversations, saveForLater] = await Promise.all([
    supabase.from('question_submissions').select('id, reviewed'),
    supabase.from('conversation_submissions').select('id, reviewed'),
    supabase.from('save_for_later_submissions').select('id, reviewed'),
  ]);

  return {
    questions: {
      total: questions.data?.length || 0,
      unreviewed: questions.data?.filter((q) => !q.reviewed).length || 0,
    },
    conversations: {
      total: conversations.data?.length || 0,
      unreviewed: conversations.data?.filter((c) => !c.reviewed).length || 0,
    },
    saveForLater: {
      total: saveForLater.data?.length || 0,
      unreviewed: saveForLater.data?.filter((s) => !s.reviewed).length || 0,
    },
  };
}

// Get all question submissions
export async function getQuestionSubmissions() {
  await requireAuth();
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from('question_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get all conversation submissions
export async function getConversationSubmissions() {
  await requireAuth();
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from('conversation_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get all save for later submissions
export async function getSaveForLaterSubmissions() {
  await requireAuth();
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from('save_for_later_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Mark submission as reviewed
export async function markAsReviewed(
  type: 'question' | 'conversation' | 'save',
  id: string,
  notes?: string
) {
  const user = await requireAuth();
  const supabase = getServiceClient();

  const tableName =
    type === 'question'
      ? 'question_submissions'
      : type === 'conversation'
      ? 'conversation_submissions'
      : 'save_for_later_submissions';

  const { error } = await supabase
    .from(tableName)
    .update({
      reviewed: true,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      notes: notes || null,
    })
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

// Export submissions to CSV
export async function exportSubmissionsCSV(type: 'question' | 'conversation' | 'save') {
  await requireAuth();
  const supabase = getServiceClient();

  const tableName =
    type === 'question'
      ? 'question_submissions'
      : type === 'conversation'
      ? 'conversation_submissions'
      : 'save_for_later_submissions';

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Convert to CSV
  if (!data || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(',')
    ),
  ].join('\n');

  return csv;
}

// Send manual email (Admin only)
export async function sendManualEmail(
  to: string[],
  subject: string,
  body: string
) {
  const user = await requireAdmin();

  const emailHtml = manualEmail(subject, body);

  const results = await Promise.all(
    to.map((email) =>
      sendEmail({
        to: email,
        subject,
        html: emailHtml,
        emailType: 'manual',
        sentBy: user.id,
      })
    )
  );

  const successful = results.filter((r) => r.success).length;
  const failed = results.length - successful;

  return {
    success: true,
    sent: successful,
    failed,
  };
}

// Get email logs
export async function getEmailLogs(limit = 50) {
  await requireAuth();
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from('email_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// ───────────────────────────────────────────────────────────
// USER MANAGEMENT (Admin only)
// ───────────────────────────────────────────────────────────

export async function getAllUsers() {
  await requireAdmin();
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, name, role, status, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createUser(email: string, role: 'admin' | 'system_user', name?: string) {
  await requireAdmin();
  const supabase = getServiceClient();

  // Check if user already exists
  const { data: existing } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (existing) {
    throw new Error('User already exists');
  }

  // Generate random temporary password
  const tempPassword = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const passwordHash = await hashPassword(tempPassword);

  // Create user
  const { data: newUser, error } = await supabase
    .from('admin_users')
    .insert({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      name: name || null,
      role,
      status: 'active',
    })
    .select('id')
    .single();

  if (error) throw error;

  // Create password reset token
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await supabase.from('password_reset_tokens').insert({
    admin_user_id: newUser.id,
    token,
    expires_at: expiresAt.toISOString(),
    used_at: null,
  });

  // Send set password email
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`;
  const emailHtml = passwordResetEmail(resetLink, true);

  await sendEmail({
    to: email,
    subject: 'Set your password - anEmpire Admin',
    html: emailHtml,
    emailType: 'password_reset',
  });

  return { success: true, userId: newUser.id };
}

export async function updateUserRole(userId: string, role: 'admin' | 'system_user') {
  const currentUser = await requireAdmin();

  // Prevent self-demotion
  if (currentUser.id === userId && role !== 'admin') {
    throw new Error('Cannot change your own role');
  }

  const supabase = getServiceClient();

  const { error } = await supabase
    .from('admin_users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw error;
  return { success: true };
}

export async function toggleUserStatus(userId: string) {
  const currentUser = await requireAdmin();

  // Prevent self-disable
  if (currentUser.id === userId) {
    throw new Error('Cannot disable your own account');
  }

  const supabase = getServiceClient();

  // Get current status
  const { data: user } = await supabase
    .from('admin_users')
    .select('status')
    .eq('id', userId)
    .single();

  if (!user) throw new Error('User not found');

  const newStatus = user.status === 'active' ? 'disabled' : 'active';

  const { error } = await supabase
    .from('admin_users')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw error;
  return { success: true, newStatus };
}

// ───────────────────────────────────────────────────────────
// BLOG MANAGEMENT
// ───────────────────────────────────────────────────────────

export async function getBlogPosts() {
  await requireAuth();

  // Read from content/posts directory
  const fs = await import('fs');
  const path = await import('path');
  const matter = await import('gray-matter');

  const postsDirectory = path.join(process.cwd(), 'content/posts');
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName: string) => fileName.endsWith('.mdx'))
    .map((fileName: string) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter.default(fileContents);

      return {
        slug,
        title: data.title,
        subtitle: data.subtitle,
        year: data.year || null,
        order: data.order,
        status: data.status,
      };
    });

  return posts.sort((a, b) => a.order - b.order);
}

export async function updateBlogPost(
  slug: string,
  updates: {
    title?: string;
    subtitle?: string;
    year?: string;
    order?: number;
    status?: 'published' | 'comingSoon';
  }
) {
  await requireAuth();

  const fs = await import('fs');
  const path = await import('path');
  const matter = await import('gray-matter');

  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error('Post not found');
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter.default(fileContents);

  // Update frontmatter
  const updatedData = {
    ...data,
    ...updates,
  };

  // Reconstruct MDX file
  const updatedMdx = matter.default.stringify(content, updatedData);

  fs.writeFileSync(filePath, updatedMdx, 'utf8');

  return { success: true };
}
