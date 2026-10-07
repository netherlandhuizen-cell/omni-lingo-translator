import React, { useState, useEffect } from 'react';
import { X, Check, MessageSquare, Send, Sparkles, Bug, Globe, MessageCircleHeart } from 'lucide-react';

export type FeedbackCategory = 'feature' | 'bug' | 'language' | 'general';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FeedbackRecord {
  id: string;
  category: FeedbackCategory;
  categoryLabel: string;
  message: string;
  email?: string;
  timestamp: string;
  userAgent?: string;
}

const CATEGORIES: Array<{
  id: FeedbackCategory;
  label: string;
  icon: typeof Sparkles;
  description: string;
}> = [
  {
    id: 'feature',
    label: 'Feature Request',
    icon: Sparkles,
    description: 'Ideas for new tools or workflow improvements',
  },
  {
    id: 'bug',
    label: 'Bug Report',
    icon: Bug,
    description: 'Something not working as expected',
  },
  {
    id: 'language',
    label: 'Language Suggestion',
    icon: Globe,
    description: 'Suggest additional languages or dialect support',
  },
  {
    id: 'general',
    label: 'General Feedback',
    icon: MessageCircleHeart,
    description: 'Thoughts, praise, or overall user experience',
  },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<FeedbackCategory>('feature');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setMessage('');
      setEmail('');
      setError(null);
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a brief message or description.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const activeCat = CATEGORIES.find((c) => c.id === category);

    const feedbackEntry: FeedbackRecord = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category,
      categoryLabel: activeCat ? activeCat.label : category,
      message: message.trim(),
      email: email.trim() || undefined,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    /**
     * =========================================================================
     * BACKEND / SERVICE INTEGRATION GUIDE:
     * =========================================================================
     * Currently stored in localStorage and logged to console.
     * To connect to a live backend service in production:
     *
     * 1. Supabase / Firebase:
     *    await supabase.from('feedbacks').insert([feedbackEntry]);
     *
     * 2. Resend / Postmark / SendGrid (Email Service):
     *    await fetch('/api/send-feedback', {
     *      method: 'POST',
     *      headers: { 'Content-Type': 'application/json' },
     *      body: JSON.stringify(feedbackEntry),
     *    });
     *
     * 3. Discord / Slack Webhook:
     *    await fetch(WEBHOOK_URL, {
     *      method: 'POST',
     *      headers: { 'Content-Type': 'application/json' },
     *      body: JSON.stringify({
     *        content: `**[${feedbackEntry.categoryLabel}]**\n${feedbackEntry.message}\n*Contact: ${feedbackEntry.email || 'None'}*`
     *      })
     *    });
     * =========================================================================
     */

    try {
      const existing = localStorage.getItem('akehboso_user_feedback') || localStorage.getItem('omni_user_feedback');
      const feedbackList: FeedbackRecord[] = existing ? JSON.parse(existing) : [];
      feedbackList.push(feedbackEntry);
      localStorage.setItem('akehboso_user_feedback', JSON.stringify(feedbackList));
    } catch (err) {
      console.warn('Could not persist feedback to localStorage:', err);
    }

    // Log neatly to the developer console for instant inspection
    console.info('[AkehBoso Feedback Recorded]', feedbackEntry);

    // Simulate brief network transition for smooth UX
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Auto close after 2.2 seconds
      setTimeout(() => {
        onClose();
      }, 2200);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white/95 dark:bg-[#0c131a]/95 rounded-3xl shadow-2xl shadow-amber-950/30 border border-slate-200/90 dark:border-amber-500/25 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Subtle top amber/emerald ambient line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-amber-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Feedback & Suggestions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help us refine AkehBoso and shape upcoming features
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          /* Thank You State */
          <div className="p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 dark:text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
              <Check className="w-8 h-8 animate-in zoom-in duration-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              Thank you for your feedback!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-6">
              Your suggestion has been logged and will help us make AkehBoso even better.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-amber-300 transition-all cursor-pointer active:scale-95 shadow-md shadow-amber-500/20 font-bold"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {/* Category Selector */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Feedback Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? 'border-amber-500/60 bg-amber-500/10 dark:bg-amber-500/15 ring-1 ring-amber-500/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-[#080d14]/50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon
                          className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
                          }`}
                        />
                        <span
                          className={`text-xs font-bold tracking-tight ${
                            isSelected
                              ? 'text-amber-950 dark:text-amber-100'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {cat.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {cat.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  Your Message
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {message.length}/1000
                </span>
              </div>
              <textarea
                value={message}
                maxLength={1000}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={
                  category === 'feature'
                    ? 'What feature or improvement would you like to see next?'
                    : category === 'bug'
                    ? 'Describe what happened and how we can reproduce it...'
                    : category === 'language'
                    ? 'Which languages, dialects, or translation pairs should we prioritize?'
                    : 'Share your thoughts, suggestions, or comments...'
                }
                rows={4}
                className="w-full p-3.5 text-xs sm:text-sm rounded-2xl bg-white dark:bg-[#070d14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all resize-none"
              />
              {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
            </div>

            {/* Optional Email */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  Email Address
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Optional</span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com (for follow-ups)"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#070d14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-amber-500/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                  isSubmitting || !message.trim()
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 text-slate-950 hover:brightness-105 shadow-amber-500/20 cursor-pointer font-bold'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
