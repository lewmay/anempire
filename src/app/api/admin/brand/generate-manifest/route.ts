import { NextResponse } from 'next/server';
import { saveWebManifest } from '@/lib/brand/assets';
import { getSession } from '@/lib/auth/service';

/**
 * Generate and save web manifest file
 */
export async function POST() {
  try {
    // Check authentication and admin role
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const manifestPath = saveWebManifest();

    return NextResponse.json({
      success: true,
      path: manifestPath,
    });
  } catch (error) {
    console.error('Failed to generate manifest:', error);
    return NextResponse.json(
      { error: 'Failed to generate manifest' },
      { status: 500 }
    );
  }
}
