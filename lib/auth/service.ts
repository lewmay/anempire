import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getServiceClient } from '@/lib/db/client';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'admin_session';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'system_user';
  status: 'active' | 'disabled';
}

export interface SessionData {
  userId: string;
  email: string;
  role: 'admin' | 'system_user';
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create JWT token
export function createToken(data: SessionData): string {
  return jwt.sign(data, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): SessionData | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionData;
  } catch {
    return null;
  }
}

// Get current session from cookies
export async function getSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const session = verifyToken(token);
    if (!session) {
      return null;
    }

    const supabase = getServiceClient();
    const { data: user } = await supabase
      .from('admin_users')
      .select('id, email, name, role, status')
      .eq('id', session.userId)
      .single();

    // Check if user is disabled
    if (user && user.status === 'disabled') {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

// Set session cookie
export async function setSession(userId: string, email: string, role: 'admin' | 'system_user') {
  const token = createToken({ userId, email, role });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Clear session cookie
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Login
export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { data: user } = await supabase
    .from('admin_users')
    .select('id, email, password_hash, role, status')
    .eq('email', email.toLowerCase())
    .single();

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  // Check if account is disabled
  if (user.status === 'disabled') {
    return { success: false, error: 'Access restricted' };
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  await setSession(user.id, user.email, user.role);
  return { success: true };
}

// Logout
export async function logout() {
  await clearSession();
}

// Create password reset token
export async function createPasswordResetToken(email: string): Promise<{ success: boolean; error?: string; token?: string }> {
  const supabase = getServiceClient();

  const { data: user } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (!user) {
    // Don't reveal if email exists
    return { success: true };
  }

  // Generate random token
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await supabase.from('password_reset_tokens').insert({
    admin_user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
    used_at: null,
  });

  return { success: true, token };
}

// Verify and use password reset token
export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { data: resetToken } = await supabase
    .from('password_reset_tokens')
    .select('*')
    .eq('token', token)
    .is('used_at', null)
    .single();

  if (!resetToken) {
    return { success: false, error: 'Invalid or expired reset link' };
  }

  // Check if expired
  if (new Date(resetToken.expires_at) < new Date()) {
    return { success: false, error: 'Reset link has expired' };
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update password
  await supabase
    .from('admin_users')
    .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
    .eq('id', resetToken.admin_user_id);

  // Mark token as used
  await supabase
    .from('password_reset_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('id', resetToken.id);

  return { success: true };
}

// Create initial admin user (for setup)
export async function createAdminUser(email: string, password: string, name?: string, role: 'admin' | 'system_user' = 'admin'): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  // Check if user already exists
  const { data: existing } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (existing) {
    return { success: false, error: 'User already exists' };
  }

  const passwordHash = await hashPassword(password);

  const { error } = await supabase.from('admin_users').insert({
    email: email.toLowerCase(),
    password_hash: passwordHash,
    name: name || null,
    role,
    status: 'active',
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Check if user has admin role
export function isAdmin(user: AdminUser | null): boolean {
  return user?.role === 'admin' && user?.status === 'active';
}

// Check if user is active (any role)
export function isActive(user: AdminUser | null): boolean {
  return user?.status === 'active';
}
