import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/service';
import { getServiceClient } from '@/lib/db/client';

// GET - fetch current email settings
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServiceClient();
    
    // Get settings from database
    const { data: settings } = await supabase
      .from('email_settings')
      .select('*')
      .single();

    if (settings) {
      return NextResponse.json({
        provider: settings.provider,
        apiKey: settings.api_key ? '••••••••' + settings.api_key.slice(-4) : '',
        fromEmail: settings.from_email || '',
        notifyEmail: settings.notify_email || '',
        isConfigured: !!settings.api_key,
      });
    }

    return NextResponse.json({
      provider: 'resend',
      apiKey: '',
      fromEmail: '',
      notifyEmail: '',
      isConfigured: false,
    });
  } catch (error) {
    console.error('Get email settings error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - save email settings
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { provider, apiKey, fromEmail, notifyEmail } = body;

    if (!apiKey || !fromEmail || !notifyEmail) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Check if settings exist
    const { data: existing } = await supabase
      .from('email_settings')
      .select('id')
      .single();

    const settingsData = {
      provider,
      api_key: apiKey.startsWith('••••') ? undefined : apiKey, // Don't update if masked
      from_email: fromEmail,
      notify_email: notifyEmail,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(settingsData).filter(([_, v]) => v !== undefined)
    );

    if (existing) {
      // Update
      const { error } = await supabase
        .from('email_settings')
        .update(cleanData)
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Insert
      const { error } = await supabase
        .from('email_settings')
        .insert({
          ...cleanData,
          api_key: apiKey,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save email settings error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
