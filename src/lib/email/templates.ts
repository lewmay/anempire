// Base email wrapper with minimal, on-brand styling
function emailWrapper(content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, serif; background-color: #f5f1eb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background-color: #fdfcfa; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
      ${content}
    </div>
    <div style="text-align: center; padding-top: 20px;">
      <p style="font-size: 14px; color: #737373; font-weight: 300;">anEmpire</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Admin notification for new question submission
export function questionSubmissionAdminEmail(data: {
  question: string;
  name?: string;
  email?: string;
  phone?: string;
  submittedAt: string;
}) {
  const content = `
    <h1 style="font-size: 24px; font-weight: 400; color: #262626; margin: 0 0 24px 0;">New Question Submitted</h1>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 16px 0;">
      <strong>Question:</strong><br>
      ${data.question.replace(/\n/g, '<br>')}
    </p>

    ${data.name ? `
    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 16px 0;">
      <strong>Name:</strong> ${data.name}
    </p>
    ` : ''}

    ${data.email ? `
    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 16px 0;">
      <strong>Email:</strong> ${data.email}
    </p>
    ` : ''}

    ${data.phone ? `
    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 16px 0;">
      <strong>Phone:</strong> ${data.phone}
    </p>
    ` : ''}

    <p style="font-size: 14px; line-height: 1.6; color: #737373; margin: 24px 0 0 0;">
      Submitted at: ${new Date(data.submittedAt).toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short'
      })}
    </p>
  `;

  return emailWrapper(content);
}

// Admin notification for new conversation request
export function conversationSubmissionAdminEmail(data: {
  businessName: string;
  role: string;
  revenueModel: string;
  revenueRange: string;
  teamSize: string;
  limitation: string;
  responsibility: string;
  willingness: string;
  additionalContext?: string;
  submittedAt: string;
}) {
  const content = `
    <h1 style="font-size: 24px; font-weight: 400; color: #262626; margin: 0 0 24px 0;">New Conversation Request</h1>

    <h2 style="font-size: 18px; font-weight: 400; color: #404040; margin: 24px 0 12px 0;">Business Information</h2>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 12px 0;">
      <strong>Business:</strong> ${data.businessName}
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 12px 0;">
      <strong>Role:</strong> ${data.role}
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 12px 0;">
      <strong>Revenue Model:</strong> ${data.revenueModel}
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 12px 0;">
      <strong>Revenue Range:</strong> ${data.revenueRange}
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 12px 0;">
      <strong>Team Size:</strong> ${data.teamSize}
    </p>

    <h2 style="font-size: 18px; font-weight: 400; color: #404040; margin: 24px 0 12px 0;">Qualifying Responses</h2>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 16px 0;">
      <strong>What is limiting growth:</strong><br>
      ${data.limitation.replace(/\n/g, '<br>')}
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 16px 0;">
      <strong>Who is responsible:</strong><br>
      ${data.responsibility.replace(/\n/g, '<br>')}
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 16px 0;">
      <strong>Willingness to change:</strong> ${data.willingness}
    </p>

    ${data.additionalContext ? `
    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 16px 0;">
      <strong>Additional context:</strong><br>
      ${data.additionalContext.replace(/\n/g, '<br>')}
    </p>
    ` : ''}

    <p style="font-size: 14px; line-height: 1.6; color: #737373; margin: 24px 0 0 0;">
      Submitted at: ${new Date(data.submittedAt).toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short'
      })}
    </p>
  `;

  return emailWrapper(content);
}

// Admin notification for save for later
export function saveForLaterAdminEmail(data: {
  email: string;
  submittedAt: string;
}) {
  const content = `
    <h1 style="font-size: 24px; font-weight: 400; color: #262626; margin: 0 0 24px 0;">New Save for Later</h1>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 16px 0;">
      <strong>Email:</strong> ${data.email}
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: #737373; margin: 24px 0 0 0;">
      Submitted at: ${new Date(data.submittedAt).toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short'
      })}
    </p>
  `;

  return emailWrapper(content);
}

// User reminder email for save for later
export function saveForLaterReminderEmail() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  const content = `
    <h1 style="font-size: 24px; font-weight: 400; color: #262626; margin: 0 0 24px 0;">The pattern is still there</h1>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 16px 0;">
      You asked for a reminder about the pattern explanation.
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 24px 0;">
      Here it is.
    </p>

    <p style="margin: 0 0 24px 0;">
      <a href="${baseUrl}/locate/patterns" style="font-size: 16px; color: #404040; text-decoration: underline;">
        Read the pattern explanation
      </a>
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: #737373; margin: 0;">
      This is the only reminder you'll receive.
    </p>
  `;

  return emailWrapper(content);
}

// Password reset email
export function passwordResetEmail(resetToken: string, isNewUser = false) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`;

  const content = isNewUser ? `
    <h1 style="font-size: 24px; font-weight: 400; color: #262626; margin: 0 0 24px 0;">Set your password</h1>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 16px 0;">
      An admin account has been created for you.
    </p>

    <p style="margin: 0 0 24px 0;">
      <a href="${resetUrl}" style="font-size: 16px; color: #404040; text-decoration: underline;">
        Set password
      </a>
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: #737373; margin: 0;">
      This link expires in 7 days.
    </p>
  ` : `
    <h1 style="font-size: 24px; font-weight: 400; color: #262626; margin: 0 0 24px 0;">Reset your password</h1>

    <p style="font-size: 16px; line-height: 1.6; color: #404040; margin: 0 0 16px 0;">
      You requested to reset your password.
    </p>

    <p style="margin: 0 0 24px 0;">
      <a href="${resetUrl}" style="font-size: 16px; color: #404040; text-decoration: underline;">
        Reset password
      </a>
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: #737373; margin: 0;">
      This link expires in 1 hour.<br>
      If you didn't request this, ignore this email.
    </p>
  `;

  return emailWrapper(content);
}

// Manual email template (for admin-sent emails)
export function manualEmail(subject: string, body: string) {
  const content = `
    <h1 style="font-size: 24px; font-weight: 400; color: #262626; margin: 0 0 24px 0;">${subject}</h1>

    <div style="font-size: 16px; line-height: 1.6; color: #404040;">
      ${body.replace(/\n/g, '<br>')}
    </div>
  `;

  return emailWrapper(content);
}
