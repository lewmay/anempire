import { NextResponse } from 'next/server';
import { getBrandAssetStatus } from '@/lib/brand/assets';
import { getSession } from '@/lib/auth/service';

/**
 * Get current status of all brand assets
 */
export async function GET() {
  try {
    // Check authentication and admin role
    const session = await getSession();
    if (!session || session.role !== 'admin') {
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
