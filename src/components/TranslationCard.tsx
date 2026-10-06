import React, { useRef, useEffect } from 'react';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  X,
  Loader2,
} from 'lucide-react';
import type { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

interface TranslationCardProps {
  lang: LanguageCode;
  text: string;
  isLoading: boolean;
  isSource: boolean;
  isCopied: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  onChange: (value: string) => void;
  onCopy: () => void;
  onSpeak: () => void;
  onVoiceInput: () => void;
  onClearCard: () => void;
}

const ACCENT_STYLES: Record<
  LanguageCode,
  {
    ring: string;
    badge: string;
    dot: string;
    headerBorder: string;
  }
> = {
  en: {
    ring: 'focus-within:ring-blue-500/30 focus-within:border-blue-500',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-900',
    dot: 'bg-blue-500',
    headerBorder: 'border-blue-500/20',
  },
  de: {
    ring: 'focus-within:ring-amber-500/30 focus-within:border-amber-500',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-900',
    dot: 'bg-amber-500',
    headerBorder: 'border-amber-500/20',
  },
  nl: {
    ring: 'focus-within:ring-orange-500/30 focus-within:border-orange-500',
    badge: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200/60 dark:border-orange-900',
    dot: 'bg-orange-500',
    headerBorder: 'border-orange-500/20',
  },
  id: {
    ring: 'focus-within:ring-emerald-500/30 focus-within:border-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900',
    dot: 'bg-emerald-500',
    headerBorder: 'border-emerald-500/20',
  },
};

export const TranslationCard: React.FC<TranslationCardProps> = ({
  lang,
  text,
  isLoading,
  isSource,
  isCopied,
  isSpeaking,
  isListening,
  onChange,
  onCopy,
  onSpeak,
  onVoiceInput,
  onClearCard,
}) => {
  const meta = SUPPORTED_LANGUAGES[lang];
  const accent = ACCENT_STYLES[lang];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      const scrollHeight = el.scrollHeight;
      el.style.height = `${Math.max(140, Math.min(scrollHeight, 400))}px`;
    }
  }, [text]);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div
      className={`relative group rounded-3xl transition-all duration-300 flex flex-col bg-white dark:bg-slate-900/90 border ${
        isSource
          ? 'border-indigo-400/80 dark:border-indigo-500/80 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/20'
          : 'border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-200/40 dark:shadow-black/20 hover:shadow-lg'
      } ${accent.ring}`}
    >
      {/* Top Header Row */}
      <div className={`px-5 pt-4 pb-3 flex items-center justify-between border-b ${accent.headerBorder} dark:border-slate-800/80`}>
        {/* Flag and Language Names */}
        <div className="flex items-center gap-2.5">
          <span className="text-2xl select-none drop-shadow-sm" role="img" aria-label={meta.name}>
            {meta.flag}
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                {meta.name}
              </h2>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wider">
                {meta.code}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta.nativeName}
            </p>
          </div>
        </div>

        {/* Status Badges & Controls */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/80 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span>Translating...</span>
            </span>
          ) : isSource && text ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Source</span>
            </span>
          ) : text && !isSource ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium text-slate-500 dark:text-slate-400">
              <Check className="w-3 h-3 text-emerald-500" />
              <span>Synced</span>
            </span>
          ) : null}

          {/* Individual Clear Button */}
          {text && (
            <button
              onClick={onClearCard}
              title={`Clear ${meta.name} text`}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Text Input Area */}
      <div className="relative flex-1 p-4 flex flex-col">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={meta.placeholder}
          aria-label={`${meta.name} translation input`}
          className="auto-expand-textarea w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base sm:text-lg leading-relaxed focus:outline-none transition-all duration-150"
        />

        {/* Listening overlay indicator if mic active */}
        {isListening && (
          <div className="absolute inset-0 bg-indigo-50/80 dark:bg-indigo-950/80 backdrop-blur-xs rounded-2xl flex items-center justify-center gap-2 text-indigo-700 dark:text-indigo-300 font-medium">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            Listening to {meta.name}... Speak now
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="px-4 py-3 bg-slate-50/60 dark:bg-slate-900/60 rounded-b-3xl border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        {/* Action Buttons: Copy, Speak, Dictate */}
        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <button
            onClick={onCopy}
            disabled={!text}
            title={isCopied ? 'Copied to clipboard!' : `Copy ${meta.name} text`}
            className={`group/btn relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 ${
              isCopied
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : text
                ? 'hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer active:scale-95'
                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Text-To-Speech Listen Button */}
          <button
            onClick={onSpeak}
            disabled={!text}
            title={isSpeaking ? 'Stop speaking' : `Pronounce in ${meta.name}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 ${
              isSpeaking
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 animate-pulse'
                : text
                ? 'hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer active:scale-95'
                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Listen</span>
              </>
            )}
          </button>

          {/* Speech-to-Text Voice Dictation Button */}
          <button
            onClick={onVoiceInput}
            title={isListening ? 'Stop voice recording' : `Dictate in ${meta.name}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 ${
              isListening
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                : 'hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer active:scale-95'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-rose-600 dark:text-rose-400">Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Voice</span>
              </>
            )}
          </button>
        </div>

        {/* Character & Word Count */}
        <div className="flex items-center gap-2 select-none font-mono text-[11px] text-slate-400 dark:text-slate-500">
          <span>{wordCount} w</span>
          <span>•</span>
          <span>{charCount} c</span>
        </div>
      </div>
    </div>
  );
};
