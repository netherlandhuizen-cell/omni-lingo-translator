import React from 'react';
import { Settings, Moon, Sun, RotateCcw } from 'lucide-react';
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
    <header className="w-full border-b border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* Minimalist modern icon mark */}
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-semibold text-sm tracking-tighter shadow-2xs">
            OL
          </div>

          <div className="flex items-baseline gap-2.5">
            <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              OmniLingo
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">
              Quad Sync
            </span>
          </div>
        </div>

        {/* Center / Status info */}
        {activeSource && (
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
            <span>Translating from <strong className="font-medium text-zinc-800 dark:text-zinc-200">{SUPPORTED_LANGUAGES[activeSource].name}</strong></span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Clear All Button */}
          <button
            onClick={onClearAll}
            disabled={!hasContent}
            title="Clear all translation boxes"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              hasContent
                ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer active:scale-98'
                : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed opacity-50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>

          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Engine Settings"
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
