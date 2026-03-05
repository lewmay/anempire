import { getServiceClient } from '@/lib/db/client';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  emailType: 'admin_notification' | 'save_reminder' | 'password_reset' | 'manual';
  sentBy?: string;
}

interface EmailSettings {
  provider: string;
  api_key: string;
  from_email: string;
  notify_email: string;
}

async function getEmailSettings(): Promise<EmailSettings | null> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from('email_settings')
    .select('*')
    .single();
  
  return data;
}

export async function sendEmail({ to, subject, html, emailType, sentBy }: SendEmailParams) {
  const supabase = getServiceClient();

  try {
    // Get settings from database
    const settings = await getEmailSettings();

    if (!settings || !settings.api_key) {
      console.warn('Email not configured - email not sent:', { to, subject });
      return { success: false, error: 'Email service not configured' };
    }

    const { provider, api_key, from_email } = settings;
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
          subject,
          html,
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
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });

      if (response.ok || response.status === 202) {
        success = true;
      } else {
        const error = await response.text();
        errorMessage = error || 'Failed to send via SendGrid';
      }
    }

    // Log the email
    try {
      await supabase.from('email_logs').insert({
        to_email: to,
        from_email: from_email,
        subject,
        body: html,
        email_type: emailType,
        sent_successfully: success,
        error_message: success ? null : errorMessage,
        sent_by: sentBy || null,
      });
    } catch (dbError) {
      console.warn('Failed to log email to database:', dbError);
    }

    if (success) {
      return { success: true };
    } else {
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Log failed send
    try {
      await supabase.from('email_logs').insert({
        to_email: to,
        from_email: 'unknown',
        subject,
        body: html,
        email_type: emailType,
        sent_successfully: false,
        error_message: errorMessage,
        sent_by: sentBy || null,
      });
    } catch (dbError) {
      console.warn('Failed to log email failure to database:', dbError);
    }

    return { success: false, error: errorMessage };
  }
}

// Helper to get the notification email address
export async function getNotifyEmail(): Promise<string | null> {
  const settings = await getEmailSettings();
  return settings?.notify_email || null;
}

