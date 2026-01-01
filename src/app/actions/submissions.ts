'use server';

import { getServiceClient } from '@/lib/db/client';
import { sendEmail } from '@/lib/email/service';
import {
  questionSubmissionAdminEmail,
  conversationSubmissionAdminEmail,
  saveForLaterAdminEmail,
  saveForLaterReminderEmail,
} from '@/lib/email/templates';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'admin@anempire.com';

// Submit question
export async function submitQuestion(formData: {
  question: string;
  name?: string;
  email?: string;
  phone?: string;
}) {
  try {
    // Check if database is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('Database not configured - question submission:', formData);
      return { success: true }; // Return success in dev mode without DB
    }

    const supabase = getServiceClient();

    // Save to database
    const { data, error } = await supabase
      .from('question_submissions')
      .insert({
        question: formData.question,
        name: formData.name || null,
        email: formData.email || null,
        phone: formData.phone || null,
        reviewed: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: 'Failed to submit question' };
    }

    // Send admin notification email
    const emailHtml = questionSubmissionAdminEmail({
      question: formData.question,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      submittedAt: data.created_at,
    });

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: 'New Question Submitted',
      html: emailHtml,
      emailType: 'admin_notification',
    });

    return { success: true };
  } catch (error) {
    console.error('Submit question error:', error);
    return { success: false, error: 'An error occurred' };
  }
}

// Submit conversation request
export async function submitConversation(formData: {
  businessName: string;
  role: string;
  revenueModel: string;
  revenueRange: string;
  teamSize: string;
  limitation: string;
  responsibility: string;
  willingness: string;
  additionalContext?: string;
}) {
  try {
    // Check if database is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('Database not configured - conversation submission:', formData);
      return { success: true }; // Return success in dev mode without DB
    }

    const supabase = getServiceClient();

    // Save to database
    const { data, error } = await supabase
      .from('conversation_submissions')
      .insert({
        business_name: formData.businessName,
        role: formData.role,
        revenue_model: formData.revenueModel,
        revenue_range: formData.revenueRange,
        team_size: formData.teamSize,
        limitation: formData.limitation,
        responsibility: formData.responsibility,
        willingness: formData.willingness,
        additional_context: formData.additionalContext || null,
        reviewed: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: 'Failed to submit conversation request' };
    }

    // Send admin notification email
    const emailHtml = conversationSubmissionAdminEmail({
      businessName: formData.businessName,
      role: formData.role,
      revenueModel: formData.revenueModel,
      revenueRange: formData.revenueRange,
      teamSize: formData.teamSize,
      limitation: formData.limitation,
      responsibility: formData.responsibility,
      willingness: formData.willingness,
      additionalContext: formData.additionalContext,
      submittedAt: data.created_at,
    });

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: 'New Conversation Request',
      html: emailHtml,
      emailType: 'admin_notification',
    });

    return { success: true };
  } catch (error) {
    console.error('Submit conversation error:', error);
    return { success: false, error: 'An error occurred' };
  }
}

// Submit save for later
export async function submitSaveForLater(formData: { email: string }) {
  try {
    // Check if database is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('Database not configured - save for later submission:', formData);
      return { success: true }; // Return success in dev mode without DB
    }

    const supabase = getServiceClient();

    // Save to database
    const { data, error } = await supabase
      .from('save_for_later_submissions')
      .insert({
        email: formData.email.toLowerCase(),
        reminder_sent: false,
        reviewed: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: 'Failed to save email' };
    }

    // Send admin notification email
    const emailHtml = saveForLaterAdminEmail({
      email: formData.email,
      submittedAt: data.created_at,
    });

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: 'New Save for Later',
      html: emailHtml,
      emailType: 'admin_notification',
    });

    // Send reminder email to user immediately
    const reminderHtml = saveForLaterReminderEmail();

    const reminderResult = await sendEmail({
      to: formData.email,
      subject: 'The pattern is still there',
      html: reminderHtml,
      emailType: 'save_reminder',
    });

    // Mark reminder as sent if successful
    if (reminderResult.success) {
      await supabase
        .from('save_for_later_submissions')
        .update({
          reminder_sent: true,
          reminder_sent_at: new Date().toISOString(),
        })
        .eq('id', data.id);
    }

    return { success: true };
  } catch (error) {
    console.error('Submit save for later error:', error);
    return { success: false, error: 'An error occurred' };
  }
}
