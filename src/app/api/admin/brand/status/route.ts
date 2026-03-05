import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/service';
import { getServiceClient } from '@/lib/db/client';
import { getBrandAssetStatus } from '@/lib/brand/assets';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

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
    .select('id, email, role, status')
    .eq('id', session.userId)
    .single();

  return user;
}

/**
 * Get current status of all brand assets
 */
export async function GET() {
  try {
    const user = await getUser();
    
    if (!user || user.status !== 'active' || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = getBrandAssetStatus();

    return NextResponse.json(status);
  } catch (error) {
    console.error('Failed to get brand asset status:', error);
    return NextResponse.json(
      { error: 'Failed to get asset status' },
      { status: 500 }
    );
  }
}
