import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/service';
import { getServiceClient } from '@/lib/db/client';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const supabase = getServiceClient();

    const [questions, conversations, saveForLater] = await Promise.all([
      supabase.from('question_submissions').select('id, reviewed'),
      supabase.from('conversation_submissions').select('id, reviewed'),
      supabase.from('save_for_later_submissions').select('id, reviewed'),
    ]);

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
