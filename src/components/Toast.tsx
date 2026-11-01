import React from 'react';
import { Bookmark, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-950/90 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 shadow-2xl text-white text-xs sm:text-sm font-semibold tracking-wide">
        <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {message.includes('★') || message.includes('Saved') ? (
            <Bookmark className="w-3.5 h-3.5 fill-emerald-400" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          )}
        </span>
        <span className="text-slate-100">{message}</span>
      </div>
    </div>
  );
};
