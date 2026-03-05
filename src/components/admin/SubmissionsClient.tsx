'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getQuestionSubmissions,
  getConversationSubmissions,
  getSaveForLaterSubmissions,
  markAsReviewed,
  exportSubmissionsCSV,
} from '@/app/actions/admin';

type SubmissionType = 'questions' | 'conversations' | 'save-for-later';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Submission = any; // Union type from different submission tables

export default function SubmissionsClient({ initialType }: { initialType: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SubmissionType>((initialType as SubmissionType) || 'questions');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (activeTab === 'questions') {
        data = await getQuestionSubmissions();
      } else if (activeTab === 'conversations') {
        data = await getConversationSubmissions();
      } else {
        data = await getSaveForLaterSubmissions();
      }
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleTabChange = (tab: SubmissionType) => {
    setActiveTab(tab);
    router.push(`/admin/submissions?type=${tab}`);
  };

  const handleMarkReviewed = async (id: string) => {
    try {
      const type = activeTab === 'questions' ? 'question' : activeTab === 'conversations' ? 'conversation' : 'save';
      await markAsReviewed(type, id, notes);
      setSelectedId(null);
      setNotes('');
      loadSubmissions();
    } catch (error) {
      console.error('Failed to mark as reviewed:', error);
    }
  };

  const handleExport = async () => {
    try {
      const type = activeTab === 'questions' ? 'question' : activeTab === 'conversations' ? 'conversation' : 'save';
      const csv = await exportSubmissionsCSV(type);

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => handleTabChange('questions')}
            className={`pb-3 px-1 font-sans transition-colors ${
              activeTab === 'questions'
                ? 'border-b-2 border-neutral-800 text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Questions
          </button>
          <button
            onClick={() => handleTabChange('conversations')}
            className={`pb-3 px-1 font-sans transition-colors ${
              activeTab === 'conversations'
                ? 'border-b-2 border-neutral-800 text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Conversations
          </button>
          <button
            onClick={() => handleTabChange('save-for-later')}
            className={`pb-3 px-1 font-sans transition-colors ${
              activeTab === 'save-for-later'
                ? 'border-b-2 border-neutral-800 text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Save for Later
          </button>
        </div>
      </div>

      {/* Export Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleExport}
          className="px-4 py-2 text-sm font-sans text-neutral-700 border border-neutral-300 hover:border-neutral-400 transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-neutral-600 font-sans">Loading...</p>
        </div>
      )}

      {/* Submissions List */}
      {!loading && submissions.length === 0 && (
        <div className="text-center py-12 bg-white border border-neutral-200">
          <p className="text-neutral-600 font-sans">No submissions yet</p>
        </div>
      )}

      {!loading && submissions.length > 0 && (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className={`bg-white border p-6 ${
                submission.reviewed ? 'border-neutral-200' : 'border-red-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {activeTab === 'questions' && (
                    <div>
                      <p className="text-base font-sans text-neutral-800 mb-2 whitespace-pre-wrap">
                        {submission.question}
                      </p>
                      {(submission.name || submission.email || submission.phone) && (
                        <div className="text-sm font-sans text-neutral-600 space-y-1">
                          {submission.name && <p>Name: {submission.name}</p>}
                          {submission.email && <p>Email: {submission.email}</p>}
                          {submission.phone && <p>Phone: {submission.phone}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'conversations' && (
                    <div>
                      <p className="text-base font-sans text-neutral-800 mb-2">
                        <strong>{submission.business_name}</strong> - {submission.role}
                      </p>
                      <div className="text-sm font-sans text-neutral-600 space-y-1 mb-3">
                        <p>Revenue: {submission.revenue_range} ({submission.revenue_model})</p>
                        <p>Team size: {submission.team_size}</p>
                        <p>Willingness: {submission.willingness}</p>
                      </div>
                      <div className="text-sm font-sans text-neutral-700 space-y-2">
                        <p><strong>Limitation:</strong> {submission.limitation}</p>
                        <p><strong>Responsibility:</strong> {submission.responsibility}</p>
                        {submission.additional_context && (
                          <p><strong>Additional:</strong> {submission.additional_context}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'save-for-later' && (
                    <div>
                      <p className="text-base font-sans text-neutral-800 mb-2">{submission.email}</p>
                      <p className="text-sm font-sans text-neutral-600">
                        Reminder sent: {submission.reminder_sent ? 'Yes' : 'No'}
                        {submission.reminder_sent_at && ` (${new Date(submission.reminder_sent_at).toLocaleDateString()})`}
                      </p>
                    </div>
                  )}
                </div>

                <div className="ml-4 text-right">
                  <p className="text-xs font-sans text-neutral-500 mb-2">
                    {new Date(submission.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {submission.reviewed ? (
                    <span className="text-xs font-sans text-green-600">Reviewed</span>
                  ) : (
                    <button
                      onClick={() => setSelectedId(selectedId === submission.id ? null : submission.id)}
                      className="text-xs font-sans text-red-600 hover:text-red-700"
                    >
                      Mark reviewed
                    </button>
                  )}
                </div>
              </div>

              {/* Review Form */}
              {selectedId === submission.id && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes (optional)"
                    className="w-full px-3 py-2 text-sm font-sans border border-neutral-300 focus:border-neutral-500 focus:outline-none resize-none"
                    rows={3}
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleMarkReviewed(submission.id)}
                      className="px-4 py-2 text-sm font-sans text-white bg-neutral-800 hover:bg-neutral-900"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setSelectedId(null);
                        setNotes('');
                      }}
                      className="px-4 py-2 text-sm font-sans text-neutral-700 border border-neutral-300 hover:border-neutral-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Show notes if reviewed */}
              {submission.reviewed && submission.notes && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-xs font-sans text-neutral-500 mb-1">Notes:</p>
                  <p className="text-sm font-sans text-neutral-700">{submission.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
