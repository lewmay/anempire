import { createAdminUser } from './service';
import { getServiceClient } from '@/lib/db/client';

let seeded = false; // In-memory flag to prevent multiple attempts per server instance

interface SeedResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Auto-seed initial admin user on first admin route access.
 *
 * Safety features:
 * - Only runs once per server instance
 * - Checks if any admin exists before creating
 * - Gracefully handles missing env vars
 * - Never crashes or blocks rendering
 * - Logs minimal information only
 */
export async function ensureInitialAdmin(): Promise<SeedResult> {
  // Skip if already seeded in this server instance
  if (seeded) {
    return { success: true, message: 'Already checked' };
  }

  try {
    // Check if database is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('[Admin Seed] Database not configured - skipping seed check');
      seeded = true;
      return {
        success: false,
        message: 'Database not configured',
        error: 'SUPABASE_SERVICE_ROLE_KEY not set'
      };
    }

    const supabase = getServiceClient();

    // Check if any admin user exists
    const { data: existingAdmins, error: queryError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('role', 'admin')
      .eq('status', 'active')
      .limit(1);

    if (queryError) {
      console.error('[Admin Seed] Database query failed:', queryError.message);
      seeded = true;
      return {
        success: false,
        message: 'Database query failed',
        error: queryError.message
      };
    }

    // Admin already exists - no action needed
    if (existingAdmins && existingAdmins.length > 0) {
      seeded = true;
      return { success: true, message: 'Admin already exists' };
    }

    // No admin exists - need to seed
    const initialPassword = process.env.INITIAL_ADMIN_PASSWORD;

    if (!initialPassword) {
      console.warn('[Admin Seed] INITIAL_ADMIN_PASSWORD not set - cannot create admin');
      seeded = true;
      return {
        success: false,
        message: 'Missing INITIAL_ADMIN_PASSWORD',
        error: 'Set INITIAL_ADMIN_PASSWORD environment variable to create initial admin'
      };
    }

    if (initialPassword.length < 8) {
      console.warn('[Admin Seed] INITIAL_ADMIN_PASSWORD too short (min 8 characters)');
      seeded = true;
      return {
        success: false,
        message: 'Password too short',
        error: 'INITIAL_ADMIN_PASSWORD must be at least 8 characters'
      };
    }

    // Create initial admin user
    console.log('[Admin Seed] Creating initial admin user: lewmay1@gmail.com');

    const result = await createAdminUser(
      'lewmay1@gmail.com',
      initialPassword,
      'Admin User',
      'admin'
    );

    seeded = true;

    if (result.success) {
      console.log('[Admin Seed] ✅ Initial admin created successfully');
      return { success: true, message: 'Initial admin created' };
    } else {
      console.error('[Admin Seed] Failed to create admin:', result.error);
      return {
        success: false,
        message: 'Failed to create admin',
        error: result.error
      };
    }

  } catch (error) {
    console.error('[Admin Seed] Unexpected error:', error);
    seeded = true;
    return {
      success: false,
      message: 'Unexpected error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Reset the seeded flag (useful for testing)
 */
export function resetSeedFlag() {
  seeded = false;
}
