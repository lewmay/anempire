'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getSaveForLaterSubmissions,
  getEmailLogs,
} from '@/app/actions/admin';

interface EmailLog {
  id: string;
  to_email: string;
  subject: string;
  email_type: string;
  sent_successfully: boolean;
  error_message: string | null;
  created_at: string;
}

interface EmailSettings {
  provider: string;
  apiKey: string;
  fromEmail: string;
  notifyEmail: string;
  isConfigured: boolean;
}

export default function EmailsClient() {
  const [view, setView] = useState<'settings' | 'logs'>('settings');
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState<EmailSettings>({
    provider: 'resend',
    apiKey: '',
    fromEmail: '',
    notifyEmail: '',
    isConfigured: false,
  });
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/email-settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load email settings:', error);
    }
  };

  const loadLogs = useCallback(async () => {
    setLoadingLogs(true);
    try {
      const logs = await getEmailLogs(100);
      setEmailLogs(logs);
    } catch (error) {
      console.error('Failed to load email logs:', error);
    }
    setLoadingLogs(false);
  }, []);

  useEffect(() => {
    if (view === 'logs') {
      loadLogs();
    }
  }, [view, loadLogs]);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveResult(null);

    try {
      const res = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (res.ok) {
        setSaveResult({ success: true, message: 'Settings saved successfully' });
        setSettings({ ...settings, isConfigured: true });
      } else {
        setSaveResult({ success: false, message: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      setSaveResult({ success: false, message: 'Network error' });
    }

    setSaving(false);
  };

  const handleTestEmail = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/admin/email-settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: settings.notifyEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setTestResult({ success: true, message: `Test email sent to ${settings.notifyEmail}` });
      } else {
        setTestResult({ success: false, message: data.error || 'Failed to send test email' });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Network error' });
    }

    setTesting(false);
  };

  return (
    <div>
      {/* View Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setView('settings')}
            className={`pb-3 px-1 font-sans transition-colors ${
              view === 'settings'
                ? 'border-b-2 border-neutral-800 text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setView('logs')}
            className={`pb-3 px-1 font-sans transition-colors ${
              view === 'logs'
                ? 'border-b-2 border-neutral-800 text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Email Logs
          </button>
        </div>
      </div>

      {/* Settings View */}
      {view === 'settings' && (
        <div className="max-w-2xl">
          <div className="bg-white border border-neutral-200 p-6 mb-6">
            <h2 className="text-xl font-sans font-light text-neutral-800 mb-2">Email Configuration</h2>
            <p className="text-sm text-neutral-600 mb-6">
              Configure your email provider to receive form submission notifications.
            </p>

            <div className="space-y-6">
              {/* Provider Selection */}
              <div>
                <label className="block text-sm font-sans text-neutral-600 mb-2">
                  Email Provider
                </label>
                <select
                  value={settings.provider}
                  onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
                  className="w-full px-4 py-3 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                >
                  <option value="resend">Resend</option>
                  <option value="sendgrid">SendGrid</option>
                </select>
                <p className="text-xs text-neutral-500 mt-1">
                  {settings.provider === 'resend' 
                    ? 'Get your API key from resend.com/api-keys' 
                    : 'Get your API key from app.sendgrid.com/settings/api_keys'}
                </p>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-sans text-neutral-600 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder={settings.provider === 'resend' ? 're_xxxxxxxxxx' : 'SG.xxxxxxxxxx'}
                  className="w-full px-4 py-3 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                />
              </div>

              {/* From Email */}
              <div>
                <label className="block text-sm font-sans text-neutral-600 mb-2">
                  From Email Address
                </label>
                <input
                  type="email"
                  value={settings.fromEmail}
                  onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                  placeholder="notifications@yourdomain.com"
                  className="w-full px-4 py-3 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Must be a verified domain/email in your {settings.provider === 'resend' ? 'Resend' : 'SendGrid'} account
                </p>
              </div>

              {/* Notification Email */}
              <div>
                <label className="block text-sm font-sans text-neutral-600 mb-2">
                  Send Notifications To
                </label>
                <input
                  type="email"
                  value={settings.notifyEmail}
                  onChange={(e) => setSettings({ ...settings, notifyEmail: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Form submissions will be sent to this email address
                </p>
              </div>

              {/* Save Result */}
              {saveResult && (
                <div className={`p-3 rounded ${saveResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`text-sm font-sans ${saveResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {saveResult.message}
                  </p>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSaveSettings}
                disabled={saving || !settings.apiKey || !settings.fromEmail || !settings.notifyEmail}
                className="px-6 py-3 text-base font-sans text-white bg-neutral-800 hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>

          {/* Test Email Section */}
          {settings.isConfigured && (
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-xl font-sans font-light text-neutral-800 mb-2">Test Configuration</h2>
              <p className="text-sm text-neutral-600 mb-6">
                Send a test email to verify your configuration is working.
              </p>

              {testResult && (
                <div className={`p-3 rounded mb-4 ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`text-sm font-sans ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testResult.message}
                  </p>
                </div>
              )}

              <button
                onClick={handleTestEmail}
                disabled={testing}
                className="px-6 py-3 text-base font-sans text-neutral-700 border border-neutral-300 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testing ? 'Sending...' : 'Send Test Email'}
              </button>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 rounded">
            <h3 className="text-sm font-sans font-medium text-neutral-800 mb-2">How it works</h3>
            <p className="text-sm text-neutral-600">
              Once configured, you'll automatically receive an email whenever someone:
            </p>
            <ul className="text-sm text-neutral-600 mt-2 space-y-1">
              <li>• Submits a question</li>
              <li>• Requests a conversation</li>
              <li>• Saves for later</li>
            </ul>
          </div>
        </div>
      )}

      {/* Logs View */}
      {view === 'logs' && (
        <div>
          {loadingLogs && (
            <div className="text-center py-12">
              <p className="text-neutral-600 font-sans">Loading...</p>
            </div>
          )}

          {!loadingLogs && emailLogs.length === 0 && (
            <div className="text-center py-12 bg-white border border-neutral-200">
              <p className="text-neutral-600 font-sans">No emails sent yet</p>
            </div>
          )}

          {!loadingLogs && emailLogs.length > 0 && (
            <div className="space-y-4">
              {emailLogs.map((log) => (
                <div
                  key={log.id}
                  className={`bg-white border p-4 ${
                    log.sent_successfully ? 'border-neutral-200' : 'border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-base font-sans text-neutral-800">{log.subject}</p>
                      <p className="text-sm font-sans text-neutral-600">To: {log.to_email}</p>
                      <p className="text-xs font-sans text-neutral-500 mt-1">
                        Type: {log.email_type}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-xs font-sans text-neutral-500 mb-1">
                        {new Date(log.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <span
                        className={`text-xs font-sans ${
                          log.sent_successfully ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {log.sent_successfully ? 'Sent' : 'Failed'}
                      </span>
                    </div>
                  </div>
                  {!log.sent_successfully && log.error_message && (
                    <p className="text-sm font-sans text-red-600 mt-2">
                      Error: {log.error_message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
