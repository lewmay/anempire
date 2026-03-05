'use server';

import { createPasswordResetToken, resetPassword as resetPasswordService, login as loginService, logout as logoutService } from '@/lib/auth/service';
import { sendEmail } from '@/lib/email/service';
import { passwordResetEmail } from '@/lib/email/templates';

export async function requestPasswordReset(email: string) {
  try {
    const result = await createPasswordResetToken(email);

    if (result.success && result.token) {
      // Send password reset email
      const emailHtml = passwordResetEmail(result.token);

      await sendEmail({
        to: email,
        subject: 'Reset your password',
        html: emailHtml,
        emailType: 'password_reset',
      });
    }

    // Always return success to prevent email enumeration
    return { success: true };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { success: true }; // Still return success to prevent email enumeration
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const result = await resetPasswordService(token, newPassword);
    return result;
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'An error occurred' };
  }
}

export async function loginAction(email: string, password: string) {
  return loginService(email, password);
}

export async function logoutAction() {
  return logoutService();
}
