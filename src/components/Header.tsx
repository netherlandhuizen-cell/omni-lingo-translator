import React from 'react';
import { Sparkles, Trash2, Settings, Moon, Sun, Globe2 } from 'lucide-react';
import type { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

interface HeaderProps {
  activeSource: LanguageCode | null;
  hasContent: boolean;
  onClearAll: () => void;
  onOpenSettings: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSource,
  hasContent,
  onClearAll,
  onOpenSettings,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="w-full max-w-7xl mx-auto pt-6 pb-4 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Globe2 className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                OmniLingo 4X
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Live 4-Way
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Type in any card — instant translation into the other 3 languages
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          {/* Active indicator pill */}
          {activeSource && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Source: <span className="font-semibold">{SUPPORTED_LANGUAGES[activeSource].name}</span> {SUPPORTED_LANGUAGES[activeSource].flag}
            </div>
          )}

          {/* Clear All Button */}
          <button
            onClick={onClearAll}
            disabled={!hasContent}
            title="Clear all 4 text boxes"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${
              hasContent
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60 dark:hover:bg-rose-900/50 cursor-pointer shadow-rose-500/10'
                : 'bg-slate-100 text-slate-400 border border-slate-200/60 dark:bg-slate-800/40 dark:text-slate-600 dark:border-slate-800 cursor-not-allowed opacity-60'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Configure Translation Engine & API Keys"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 active:scale-95 border border-slate-200/80 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-white text-slate-600 hover:bg-slate-50 active:scale-95 border border-slate-200/80 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 transition-all duration-200 shadow-sm cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
