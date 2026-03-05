import { createClient } from '@supabase/supabase-js';

// Placeholder values for development when env vars are not set
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Client for public operations
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Admin client with service role for server-side operations
export function getServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set - database operations will fail');
    // Return a placeholder client that will fail gracefully
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return createClient(
    SUPABASE_URL,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>;
      };
      question_submissions: {
        Row: {
          id: string;
          question: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          reviewed: boolean;
          reviewed_at: string | null;
          reviewed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['question_submissions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['question_submissions']['Insert']>;
      };
      conversation_submissions: {
        Row: {
          id: string;
          business_name: string;
          role: string;
          revenue_model: string;
          revenue_range: string;
          team_size: string;
          limitation: string;
          responsibility: string;
          willingness: string;
          additional_context: string | null;
          reviewed: boolean;
          reviewed_at: string | null;
          reviewed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['conversation_submissions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['conversation_submissions']['Insert']>;
      };
      save_for_later_submissions: {
        Row: {
          id: string;
          email: string;
          reminder_sent: boolean;
          reminder_sent_at: string | null;
          reviewed: boolean;
          reviewed_at: string | null;
          reviewed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['save_for_later_submissions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['save_for_later_submissions']['Insert']>;
      };
      email_logs: {
        Row: {
          id: string;
          to_email: string;
          from_email: string;
          subject: string;
          body: string;
          email_type: string;
          sent_successfully: boolean;
          error_message: string | null;
          sent_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['email_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['email_logs']['Insert']>;
      };
      password_reset_tokens: {
        Row: {
          id: string;
          admin_user_id: string;
          token: string;
          expires_at: string;
          used_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['password_reset_tokens']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['password_reset_tokens']['Insert']>;
      };
    };
  };
};
