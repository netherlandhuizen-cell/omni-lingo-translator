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
    <header className="relative w-full border-b border-slate-200/80 dark:border-cyan-500/20 bg-white/90 dark:bg-[#070e1b]/90 backdrop-blur-2xl sticky top-0 z-30 transition-colors shadow-xs dark:shadow-cyan-950/20">
      {/* Top subtle neon line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 dark:via-cyan-400 to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* Vibrant gradient emblem */}
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-xs tracking-tight shadow-md shadow-cyan-500/20 ring-1 ring-cyan-300/40 select-none">
            OL
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              OmniLingo
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              v2.4 Pro
            </span>
          </div>
        </div>

        {/* Center / Status info */}
        {activeSource ? (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-cyan-500/20 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-slate-500 dark:text-slate-400">Master Source:</span>
            <strong className="font-semibold text-slate-800 dark:text-cyan-300">
              {SUPPORTED_LANGUAGES[activeSource].name}
            </strong>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800/80 text-xs text-slate-400 dark:text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-[11px] tracking-wide">4-WAY MESH ACTIVE</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Clear All Button */}
          <button
            onClick={onClearAll}
            disabled={!hasContent}
            title="Clear all translation boxes"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
              hasContent
                ? 'text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 hover:border-rose-500/30 cursor-pointer active:scale-95'
                : 'text-slate-400 dark:text-slate-600 bg-slate-100/40 dark:bg-slate-900/40 border border-transparent cursor-not-allowed opacity-50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200 dark:border-cyan-500/20 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Engine Settings"
            className="p-2 rounded-xl text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300 bg-slate-100/60 dark:bg-slate-800/60 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 border border-slate-200/60 dark:border-slate-700/60 hover:border-cyan-500/30 transition-all cursor-pointer active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 bg-slate-100/60 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200/60 dark:border-slate-700/60 hover:border-amber-500/30 transition-all cursor-pointer active:scale-95"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
