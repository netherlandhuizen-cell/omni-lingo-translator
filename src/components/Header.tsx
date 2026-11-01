import React from 'react';
import { Settings, Moon, Sun, RotateCcw, MessageSquare, Zap, Layers } from 'lucide-react';
import type { LanguageCode, ActiveTab } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  deckCount: number;
  activeSource: LanguageCode | null;
  hasContent: boolean;
  onClearAll: () => void;
  onOpenSettings: () => void;
  onOpenFeedback: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  deckCount,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Clean minimal status beacon (when active) */}
        <div className="flex items-center min-w-0">
          {activeSource && activeTab === 'workspace' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-white/10 text-xs shadow-lg">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">Master:</span>
              <strong className="font-bold text-slate-900 dark:text-emerald-300 truncate max-w-[100px] sm:max-w-none">
                {SUPPORTED_LANGUAGES[activeSource]?.name || activeSource}
              </strong>
            </div>
          ) : (
            <div className="w-1" />
          )}
        </div>

        {/* Center: Navigation Tab Switcher */}
        <nav
          aria-label="Navigation Tabs"
          className="flex items-center p-1 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-lg"
        >
          <button
            type="button"
            onClick={() => onTabChange('workspace')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
              activeTab === 'workspace'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Live Workspace</span>
            <span className="sm:hidden">Workspace</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('deck')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
              activeTab === 'deck'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Study Deck</span>
            <span className="sm:hidden">Deck</span>
            {deckCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'deck'
                    ? 'bg-slate-950/20 text-slate-950'
                    : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {deckCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Floating Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Clear All Button (Relevant for workspace) */}
          {activeTab === 'workspace' && (
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
              <span className="hidden sm:inline">Clear all</span>
            </button>
          )}

          <div className="h-4 w-[1px] bg-white/30 dark:bg-white/10 mx-0.5 hidden sm:block" />

          {/* Feedback Button */}
          <button
            onClick={onOpenFeedback}
            title="Feedback & Feature Suggestions"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-300 bg-white/50 dark:bg-slate-900/50 hover:bg-white/70 dark:hover:bg-slate-800/70 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Feedback</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Engine Settings"
            className="p-2 rounded-xl text-slate-800 hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-300 bg-white/50 dark:bg-slate-900/50 hover:bg-white/70 dark:hover:bg-slate-800/70 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-slate-800 hover:text-emerald-500 dark:text-slate-200 dark:hover:text-emerald-400 bg-white/50 dark:bg-slate-900/50 hover:bg-white/70 dark:hover:bg-slate-800/70 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-lg transition-all cursor-pointer active:scale-95"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
