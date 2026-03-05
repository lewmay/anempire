import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/service';
import { getServiceClient } from '@/lib/db/client';

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
    const { to } = body;

    if (!to) {
      return NextResponse.json({ error: 'Recipient email required' }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Get email settings
    const { data: settings } = await supabase
      .from('email_settings')
      .select('*')
      .single();

    if (!settings || !settings.api_key) {
      return NextResponse.json({ error: 'Email not configured' }, { status: 400 });
    }

    const { provider, api_key, from_email } = settings;

    // Send test email based on provider
    let success = false;
    let errorMessage = '';

    if (provider === 'resend') {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: from_email,
          to: [to],
          subject: 'Test Email from anEmpire',
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px;">
              <h1 style="font-size: 24px; font-weight: 400; color: #262626;">Test Email</h1>
              <p style="font-size: 16px; color: #404040; line-height: 1.6;">
                This is a test email from your anEmpire admin panel.
              </p>
              <p style="font-size: 16px; color: #404040; line-height: 1.6;">
                If you're seeing this, your email configuration is working correctly!
              </p>
              <p style="font-size: 14px; color: #737373; margin-top: 24px;">
                Sent via Resend
              </p>
            </div>
          `,
        }),
      });

      if (response.ok) {
        success = true;
      } else {
        const error = await response.json();
        errorMessage = error.message || 'Failed to send via Resend';
      }
    } else if (provider === 'sendgrid') {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: from_email },
          subject: 'Test Email from anEmpire',
          content: [
            {
              type: 'text/html',
              value: `
                <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px;">
                  <h1 style="font-size: 24px; font-weight: 400; color: #262626;">Test Email</h1>
                  <p style="font-size: 16px; color: #404040; line-height: 1.6;">
                    This is a test email from your anEmpire admin panel.
                  </p>
                  <p style="font-size: 16px; color: #404040; line-height: 1.6;">
                    If you're seeing this, your email configuration is working correctly!
                  </p>
                  <p style="font-size: 14px; color: #737373; margin-top: 24px;">
                    Sent via SendGrid
                  </p>
                </div>
              `,
            },
          ],
        }),
      });

      if (response.ok || response.status === 202) {
        success = true;
      } else {
        const error = await response.text();
        errorMessage = error || 'Failed to send via SendGrid';
      }
    }

    // Log the test email
    await supabase.from('email_logs').insert({
      to_email: to,
      from_email: from_email,
      subject: 'Test Email from anEmpire',
      body: 'Test email',
      email_type: 'manual',
      sent_successfully: success,
      error_message: success ? null : errorMessage,
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
