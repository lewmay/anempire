-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'system_user', -- 'admin' or 'system_user'
  status TEXT NOT NULL DEFAULT 'active', -- 'active' or 'disabled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Question Submissions Table
CREATE TABLE IF NOT EXISTS question_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES admin_users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation Submissions Table
CREATE TABLE IF NOT EXISTS conversation_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  role TEXT NOT NULL,
  revenue_model TEXT NOT NULL,
  revenue_range TEXT NOT NULL,
  team_size TEXT NOT NULL,
  limitation TEXT NOT NULL,
  responsibility TEXT NOT NULL,
  willingness TEXT NOT NULL,
  additional_context TEXT,
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES admin_users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Save for Later Submissions Table
CREATE TABLE IF NOT EXISTS save_for_later_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES admin_users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  from_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'admin_notification', 'save_reminder', 'password_reset', 'manual'
  sent_successfully BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  sent_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_question_submissions_created_at ON question_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_question_submissions_reviewed ON question_submissions(reviewed);
CREATE INDEX IF NOT EXISTS idx_conversation_submissions_created_at ON conversation_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_submissions_reviewed ON conversation_submissions(reviewed);
CREATE INDEX IF NOT EXISTS idx_save_for_later_created_at ON save_for_later_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_save_for_later_reminder_sent ON save_for_later_submissions(reminder_sent);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
