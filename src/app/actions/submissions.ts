'use server';

import { getServiceClient } from '@/lib/db/client';
import { sendEmail, getNotifyEmail } from '@/lib/email/service';
import { db } from '@/lib/db';
import {
  questionSubmissionAdminEmail,
  conversationSubmissionAdminEmail,
  saveForLaterAdminEmail,
  saveForLaterReminderEmail,
} from '@/lib/email/templates';




export async function submitQuestion(data: {
  question: string;
  name?: string;
  email?: string;
  phone?: string;
}) {
  try {

    // ✅ Question
    if (!data.question || data.question.trim().length < 10) {
      return { success: false, error: 'Question must be at least 10 characters.' };
    }

    // ✅ Name REQUIRED
    if (!data.name || data.name.trim().length < 2) {
      return { success: false, error: 'Name is required and must be at least 2 characters.' };
    }

    // ✅ Email REQUIRED
    if (!data.email) {
      return { success: false, error: 'Email is required.' };
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: 'Invalid email address.' };
    }

    // ✅ Phone REQUIRED
    if (!data.phone) {
      return { success: false, error: 'Phone is required.' };
    }

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!phoneRegex.test(data.phone)) {
      return { success: false, error: 'Invalid phone number.' };
    }

    // ✅ Insert
    await db.execute(
      `INSERT INTO questions (question, name, email, phone)
       VALUES (?, ?, ?, ?)`,
      [
        data.question,
        data.name,
        data.email,
        data.phone,
      ]
    );

    return { success: true };

  } catch (error) {
    console.error(error);
    return { success: false, error: 'Database error.' };
  }
}


// Submit conversation request
export async function submitConversation(data: {
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

    // ✅ Validation (SERVER SIDE - SECURITY)

    if (!data.businessName || data.businessName.trim().length < 2) {
      return { success: false, error: "Business name is required." };
    }

    if (!data.role || data.role.trim().length < 2) {
      return { success: false, error: "Role is required." };
    }

    if (!data.revenueModel) {
      return { success: false, error: "Revenue model is required." };
    }

    if (!data.revenueRange) {
      return { success: false, error: "Revenue range is required." };
    }

    if (!data.teamSize) {
      return { success: false, error: "Team size is required." };
    }

    if (!data.limitation || data.limitation.trim().length < 10) {
      return { success: false, error: "Limitation must be at least 10 characters." };
    }

    if (!data.responsibility || data.responsibility.trim().length < 10) {
      return { success: false, error: "Responsibility must be at least 10 characters." };
    }

    if (!data.willingness) {
      return { success: false, error: "Willingness selection is required." };
    }

    // ✅ Insert Into Database
    await db.execute(
      `INSERT INTO conversations 
      (business_name, role, revenue_model, revenue_range, team_size, limitation, responsibility, willingness, additional_context)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.businessName,
        data.role,
        data.revenueModel,
        data.revenueRange,
        data.teamSize,
        data.limitation,
        data.responsibility,
        data.willingness,
        data.additionalContext || null
      ]
    );

    return { success: true };

  } catch (error) {
    console.error(error);
    return { success: false, error: "Database error." };
  }
}
// export async function submitConversation(formData: {
//   businessName: string;
//   role: string;
//   revenueModel: string;
//   revenueRange: string;
//   teamSize: string;
//   limitation: string;
//   responsibility: string;
//   willingness: string;
//   additionalContext?: string;
// }) {
//   try {
//     // Check if database is configured
//     if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
//       console.warn('Database not configured - conversation submission:', formData);
//       return { success: true }; // Return success in dev mode without DB
//     }

//     const supabase = getServiceClient();

//     // Save to database
//     const { data, error } = await supabase
//       .from('conversation_submissions')
//       .insert({
//         business_name: formData.businessName,
//         role: formData.role,
//         revenue_model: formData.revenueModel,
//         revenue_range: formData.revenueRange,
//         team_size: formData.teamSize,
//         limitation: formData.limitation,
//         responsibility: formData.responsibility,
//         willingness: formData.willingness,
//         additional_context: formData.additionalContext || null,
//         reviewed: false,
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error('Database error:', error);
//       return { success: false, error: 'Failed to submit conversation request' };
//     }

//     // Get notification email from settings
//     const notifyEmail = await getNotifyEmail();

//     if (notifyEmail) {
//       // Send admin notification email
//       const emailHtml = conversationSubmissionAdminEmail({
//         businessName: formData.businessName,
//         role: formData.role,
//         revenueModel: formData.revenueModel,
//         revenueRange: formData.revenueRange,
//         teamSize: formData.teamSize,
//         limitation: formData.limitation,
//         responsibility: formData.responsibility,
//         willingness: formData.willingness,
//         additionalContext: formData.additionalContext,
//         submittedAt: data.created_at,
//       });

//       await sendEmail({
//         to: notifyEmail,
//         subject: 'New Conversation Request',
//         html: emailHtml,
//         emailType: 'admin_notification',
//       });
//     }

//     return { success: true };
//   } catch (error) {
//     console.error('Submit conversation error:', error);
//     return { success: false, error: 'An error occurred' };
//   }
// }

// // Submit save for later
// export async function submitSaveForLater(formData: { email: string }) {
//   try {
//     // Check if database is configured
//     if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
//       console.warn('Database not configured - save for later submission:', formData);
//       return { success: true }; // Return success in dev mode without DB
//     }

//     const supabase = getServiceClient();

//     // Save to database
//     const { data, error } = await supabase
//       .from('save_for_later_submissions')
//       .insert({
//         email: formData.email.toLowerCase(),
//         reminder_sent: false,
//         reviewed: false,
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error('Database error:', error);
//       return { success: false, error: 'Failed to save email' };
//     }

//     // Get notification email from settings
//     const notifyEmail = await getNotifyEmail();

//     if (notifyEmail) {
//       // Send admin notification email
//       const emailHtml = saveForLaterAdminEmail({
//         email: formData.email,
//         submittedAt: data.created_at,
//       });

//       await sendEmail({
//         to: notifyEmail,
//         subject: 'New Save for Later',
//         html: emailHtml,
//         emailType: 'admin_notification',
//       });
//     }

//     // Send reminder email to user immediately
//     const reminderHtml = saveForLaterReminderEmail();

//     const reminderResult = await sendEmail({
//       to: formData.email,
//       subject: 'The pattern is still there',
//       html: reminderHtml,
//       emailType: 'save_reminder',
//     });

//     // Mark reminder as sent if successful
//     if (reminderResult.success) {
//       await supabase
//         .from('save_for_later_submissions')
//         .update({
//           reminder_sent: true,
//           reminder_sent_at: new Date().toISOString(),
//         })
//         .eq('id', data.id);
//     }

//     return { success: true };
//   } catch (error) {
//     console.error('Submit save for later error:', error);
//     return { success: false, error: 'An error occurred' };
//   }
// }
