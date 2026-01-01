'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getSaveForLaterSubmissions,
  sendManualEmail,
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

export default function EmailsClient() {
  const [view, setView] = useState<'compose' | 'logs'>('compose');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [segment, setSegment] = useState<'save-for-later' | 'all'>('save-for-later');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [recipientCount, setRecipientCount] = useState(0);

  const loadRecipientCount = useCallback(async () => {
    try {
      if (segment === 'save-for-later') {
        const submissions = await getSaveForLaterSubmissions();
        setRecipientCount(submissions.length);
      } else {
        setRecipientCount(0);
      }
    } catch (error) {
      console.error('Failed to load recipient count:', error);
    }
  }, [segment]);

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

  useEffect(() => {
    loadRecipientCount();
  }, [segment, loadRecipientCount]);

  const handleConfirm = () => {
    setIsConfirming(true);
  };

  const handleSend = async () => {
    setIsSending(true);
    setResult(null);

    try {
      // Get recipients based on segment
      let recipients: string[] = [];

      if (segment === 'save-for-later') {
        const submissions = await getSaveForLaterSubmissions();
        recipients = submissions.map((s: { email: string }) => s.email);
      }

      // Send emails
      const sendResult = await sendManualEmail(recipients, subject, body);
      setResult({ sent: sendResult.sent, failed: sendResult.failed });

      // Clear form on success
      if (sendResult.sent > 0) {
        setSubject('');
        setBody('');
        setIsConfirming(false);
      }
    } catch (error) {
      console.error('Failed to send emails:', error);
    }

    setIsSending(false);
  };

  return (
    <div>
      {/* View Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setView('compose')}
            className={`pb-3 px-1 font-sans transition-colors ${
              view === 'compose'
                ? 'border-b-2 border-neutral-800 text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Compose
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

      {/* Compose View */}
      {view === 'compose' && (
        <div className="max-w-2xl">
          <div className="bg-white border border-neutral-200 p-6 mb-6">
            <h2 className="text-xl font-sans font-light text-neutral-800 mb-6">Send Email</h2>

            <div className="space-y-6">
              {/* Segment Selection */}
              <div>
                <label className="block text-sm font-sans text-neutral-600 mb-2">
                  Send to
                </label>
                <select
                  value={segment}
                  onChange={(e) => setSegment(e.target.value as 'save-for-later' | 'all')}
                  className="w-full px-4 py-3 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                >
                  <option value="save-for-later">Save for Later subscribers ({recipientCount})</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-sans text-neutral-600 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                  placeholder="Email subject"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-sans text-neutral-600 mb-2">
                  Message
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none resize-none"
                  placeholder="Email body (plain text)"
                />
              </div>

              {/* Confirmation */}
              {!isConfirming && (
                <button
                  onClick={handleConfirm}
                  disabled={!subject || !body || recipientCount === 0}
                  className="px-6 py-3 text-base font-sans text-white bg-neutral-800 hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review & Send
                </button>
              )}

              {/* Confirmation Step */}
              {isConfirming && !result && (
                <div className="p-4 bg-yellow-50 border border-yellow-200">
                  <p className="text-sm font-sans text-yellow-900 mb-3">
                    You are about to send this email to {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSend}
                      disabled={isSending}
                      className="px-6 py-2 text-sm font-sans text-white bg-neutral-800 hover:bg-neutral-900 disabled:opacity-50"
                    >
                      {isSending ? 'Sending...' : 'Confirm & Send'}
                    </button>
                    <button
                      onClick={() => setIsConfirming(false)}
                      disabled={isSending}
                      className="px-6 py-2 text-sm font-sans text-neutral-700 border border-neutral-300 hover:border-neutral-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="p-4 bg-green-50 border border-green-200">
                  <p className="text-sm font-sans text-green-900">
                    Sent to {result.sent} recipient{result.sent !== 1 ? 's' : ''}.
                    {result.failed > 0 && ` ${result.failed} failed.`}
                  </p>
                </div>
              )}
            </div>
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
