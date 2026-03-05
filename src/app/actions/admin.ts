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
// BLOG MANAGEMENT (Database-backed)
// ───────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  year: string | null;
  display_order: number;
  status: 'published' | 'comingSoon' | 'draft';
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  await requireAuth();
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  await requireAuth();
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

export async function createBlogPost(post: {
  title: string;
  subtitle?: string;
  slug: string;
  content?: string;
  year?: string;
  display_order?: number;
  status?: 'published' | 'comingSoon' | 'draft';
}): Promise<BlogPost> {
  const user = await requireAuth();
  const supabase = getServiceClient();

  // Check if slug already exists
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', post.slug)
    .single();

  if (existing) {
    throw new Error('A post with this slug already exists');
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title: post.title,
      subtitle: post.subtitle || null,
      slug: post.slug,
      content: post.content || '',
      year: post.year || null,
      display_order: post.display_order || 0,
      status: post.status || 'draft',
      created_by: user.id,
      updated_by: user.id,
      published_at: post.status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlogPost(
  id: string,
  updates: {
    title?: string;
    subtitle?: string;
    slug?: string;
    content?: string;
    year?: string;
    display_order?: number;
    status?: 'published' | 'comingSoon' | 'draft';
  }
): Promise<BlogPost> {
  const user = await requireAuth();
  const supabase = getServiceClient();

  // If slug is being changed, check it doesn't conflict
  if (updates.slug) {
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', updates.slug)
      .neq('id', id)
      .single();

    if (existing) {
      throw new Error('A post with this slug already exists');
    }
  }

  // Get current post to check if status is changing to published
  const { data: currentPost } = await supabase
    .from('blog_posts')
    .select('status, published_at')
    .eq('id', id)
    .single();

  const updateData: Record<string, unknown> = {
    ...updates,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  };

  // Set published_at if publishing for the first time
  if (updates.status === 'published' && currentPost?.status !== 'published' && !currentPost?.published_at) {
    updateData.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean }> {
  await requireAdmin(); // Only admins can delete
  const supabase = getServiceClient();

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

export async function reorderBlogPosts(orderedIds: string[]): Promise<{ success: boolean }> {
  await requireAuth();
  const supabase = getServiceClient();

  // Update each post with its new order
  const updates = orderedIds.map((id, index) =>
    supabase
      .from('blog_posts')
      .update({ display_order: index + 1 })
      .eq('id', id)
  );

  await Promise.all(updates);
  return { success: true };
}
