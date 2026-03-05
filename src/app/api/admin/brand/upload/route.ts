import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/service';
import { getServiceClient } from '@/lib/db/client';

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
 * Admin-only file upload endpoint for brand assets
 * Note: File uploads don't persist on Netlify's serverless environment.
 * This endpoint is here for local development only.
 * For production, upload files directly to your repo or a CDN.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user || user.status !== 'active' || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // On Netlify, file system writes don't persist
    // Return an informative error message
    return NextResponse.json(
      { 
        error: 'File uploads are not supported on Netlify. Please add brand assets directly to your GitHub repository in the /public folder.',
        suggestion: 'Upload files to: public/og-image.png, public/favicon.ico, public/favicon-16.png, public/favicon-32.png, public/apple-touch-icon.png'
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload request' },
      { status: 500 }
    );
  }
}
