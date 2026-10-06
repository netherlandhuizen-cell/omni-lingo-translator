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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      const scrollHeight = el.scrollHeight;
      el.style.height = `${Math.max(160, Math.min(scrollHeight, 460))}px`;
    }
  }, [text]);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div
      className={`group relative rounded-3xl bg-white/95 dark:bg-[#0c1427]/85 backdrop-blur-2xl border transition-all duration-300 flex flex-col overflow-hidden ${
        isSource
          ? 'border-cyan-500/60 dark:border-cyan-400/60 shadow-xl shadow-cyan-950/20 dark:shadow-cyan-950/40 ring-2 ring-cyan-500/25 dark:ring-cyan-400/20'
          : 'border-slate-200/90 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-cyan-500/30 shadow-md shadow-slate-950/5 dark:shadow-2xl'
      }`}
    >
      {/* Top subtle glow line on active source card */}
      {isSource && (
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 dark:via-cyan-400 to-transparent opacity-90" />
      )}

      {/* Clean Top Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-cyan-500/10">
        {/* Language Identity */}
        <div className="flex items-center gap-3">
          <span className="text-xl select-none leading-none drop-shadow-xs" role="img" aria-label={meta.name}>
            {meta.flag}
          </span>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {meta.name}
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-cyan-300 font-semibold border border-slate-200/70 dark:border-cyan-500/20 uppercase tracking-wide">
              {meta.code}
            </span>
          </div>
        </div>

        {/* Dynamic Status & Card Clear */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300">
              <Loader2 className="w-3 h-3 animate-spin text-cyan-500" />
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">syncing</span>
            </div>
          ) : isSource && text ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">master</span>
            </div>
          ) : null}

          {text && (
            <button
              onClick={onClearCard}
              title={`Clear ${meta.name}`}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Textarea Area */}
      <div className="relative flex-1 p-6 flex flex-col">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={meta.placeholder}
          aria-label={`${meta.name} translation`}
          className="auto-expand-textarea w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-[15px] sm:text-base leading-relaxed focus:outline-none transition-colors duration-100 font-normal"
        />

        {/* Minimal Voice Dictation Indicator */}
        {isListening && (
          <div className="absolute inset-0 bg-slate-950/90 rounded-b-3xl backdrop-blur-md flex flex-col items-center justify-center gap-2.5 text-xs text-white font-medium z-10 border-t border-rose-500/30">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-6 bg-rose-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
              <span className="w-1.5 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            </div>
            <span className="font-mono text-rose-300 text-[11px] uppercase tracking-wider">Listening in {meta.name}... Speak now</span>
          </div>
        )}
      </div>

      {/* Refined Bottom Actions */}
      <div className="px-5 py-3 bg-slate-50/80 dark:bg-[#080e1b]/80 rounded-b-3xl border-t border-slate-100 dark:border-cyan-500/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <button
            onClick={onCopy}
            disabled={!text}
            title={isCopied ? 'Copied' : `Copy ${meta.name}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isCopied
                ? 'text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30'
                : text
                ? 'text-slate-600 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300 hover:bg-slate-200/60 dark:hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 cursor-pointer active:scale-95'
                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed border border-transparent'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>

          {/* Pronounce / Listen */}
          <button
            onClick={onSpeak}
            disabled={!text}
            title={isSpeaking ? 'Stop playback' : `Pronounce in ${meta.name}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSpeaking
                ? 'text-cyan-600 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/40'
                : text
                ? 'text-slate-600 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300 hover:bg-slate-200/60 dark:hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 cursor-pointer active:scale-95'
                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed border border-transparent'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="text-[11px]">Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Listen</span>
              </>
            )}
          </button>

          {/* Microphone Voice Dictation */}
          <button
            onClick={onVoiceInput}
            title={isListening ? 'Stop recording' : `Dictate in ${meta.name}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isListening
                ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-500/40'
                : 'text-slate-600 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-300 hover:bg-slate-200/60 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-500/20 cursor-pointer active:scale-95'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[11px]">Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Voice</span>
              </>
            )}
          </button>
        </div>

        {/* Monospace count metrics */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 dark:text-slate-500 select-none">
          <span className="text-slate-700 dark:text-slate-300 font-semibold">{wordCount}</span>
          <span>w</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">{charCount}</span>
          <span>c</span>
        </div>
      </div>
    </div>
  );
};
