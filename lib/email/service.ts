import { Resend } from 'resend';
import { getServiceClient } from '@/lib/db/client';

// Use placeholder API key if not set (for development)
const RESEND_API_KEY = process.env.RESEND_API_KEY || 'placeholder-resend-key';
const resend = new Resend(RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  emailType: 'admin_notification' | 'save_reminder' | 'password_reset' | 'manual';
  sentBy?: string;
}

export async function sendEmail({ to, subject, html, emailType, sentBy }: SendEmailParams) {
  const from = process.env.EMAIL_FROM || 'noreply@anempire.com';
  const supabase = getServiceClient();

  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured - email not sent:', { to, subject });
      return { success: false, error: 'Email service not configured' };
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      throw error;
    }

    // Log successful send (ignore DB errors in development)
    try {
      await supabase.from('email_logs').insert({
        to_email: to,
        from_email: from,
        subject,
        body: html,
        email_type: emailType,
        sent_successfully: true,
        error_message: null,
        sent_by: sentBy || null,
      });
    } catch (dbError) {
      console.warn('Failed to log email send to database:', dbError);
    }

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Log failed send (ignore DB errors in development)
    try {
      await supabase.from('email_logs').insert({
        to_email: to,
        from_email: from,
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
