import React from 'react';
import { Settings, Moon, Sun, RotateCcw, MessageSquare } from 'lucide-react';
import type { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

interface HeaderProps {
  activeSource: LanguageCode | null;
  hasContent: boolean;
  onClearAll: () => void;
  onOpenSettings: () => void;
  onOpenFeedback: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSource,
  hasContent,
  onClearAll,
  onOpenSettings,
  onOpenFeedback,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="relative w-full bg-transparent z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left Side: Clean minimal status beacon (no small logo text) */}
        <div>
          {activeSource && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-white/10 text-xs shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Master:</span>
              <strong className="font-bold text-slate-900 dark:text-amber-300">
                {SUPPORTED_LANGUAGES[activeSource]?.name || activeSource}
              </strong>
            </div>
          )}
        </div>

        {/* Right Floating Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Clear All Button */}
          <button
            onClick={onClearAll}
            disabled={!hasContent}
            title="Clear all translation boxes"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all duration-150 ${
              hasContent
                ? 'text-slate-800 hover:text-rose-600 dark:text-slate-200 dark:hover:text-rose-400 bg-white/50 dark:bg-slate-900/50 hover:bg-rose-500/20 border border-white/60 dark:border-white/10 shadow-lg cursor-pointer active:scale-95'
                : 'text-slate-400 dark:text-slate-600 bg-white/20 dark:bg-slate-900/20 border border-transparent cursor-not-allowed opacity-50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>

          <div className="h-4 w-[1px] bg-white/30 dark:bg-white/10 mx-1 hidden sm:block" />

          {/* Feedback Button */}
          <button
            onClick={onOpenFeedback}
            title="Feedback & Feature Suggestions"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 hover:text-amber-600 dark:text-slate-200 dark:hover:text-amber-300 bg-white/50 dark:bg-slate-900/50 hover:bg-white/70 dark:hover:bg-slate-800/70 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Feedback</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Engine Settings"
            className="p-2 rounded-xl text-slate-800 hover:text-amber-600 dark:text-slate-200 dark:hover:text-amber-300 bg-white/50 dark:bg-slate-900/50 hover:bg-white/70 dark:hover:bg-slate-800/70 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-slate-800 hover:text-amber-500 dark:text-slate-200 dark:hover:text-amber-400 bg-white/50 dark:bg-slate-900/50 hover:bg-white/70 dark:hover:bg-slate-800/70 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-lg transition-all cursor-pointer active:scale-95"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
