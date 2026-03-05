import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/service';
import { getServiceClient } from '@/lib/db/client';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No session cookie found' });
  }

  const session = verifyToken(token);
  
  if (!session) {
    return NextResponse.json({ error: 'Token invalid or expired', tokenStart: token.substring(0, 20) });
  }

  const supabase = getServiceClient();
  const { data: user, error } = await supabase
    .from('admin_users')
    .select('id, email, role, status')
    .eq('id', session.userId)
    .single();

  return NextResponse.json({ 
    session,
    user,
    dbError: error?.message
  });
}
