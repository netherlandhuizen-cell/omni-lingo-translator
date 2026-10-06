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
      className={`group relative rounded-3xl bg-white dark:bg-zinc-900/80 backdrop-blur-md border transition-all duration-200 flex flex-col ${
        isSource
          ? 'border-zinc-400 dark:border-zinc-500 shadow-md ring-1 ring-zinc-400/20 dark:ring-white/10'
          : 'border-zinc-200/80 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 shadow-xs dark:shadow-2xl'
      }`}
    >
      {/* Clean Top Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-100 dark:border-white/5">
        {/* Language Identity */}
        <div className="flex items-center gap-2.5">
          <span className="text-lg select-none leading-none" role="img" aria-label={meta.name}>
            {meta.flag}
          </span>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {meta.name}
            </h2>
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">
              {meta.code}
            </span>
          </div>
        </div>

        {/* Minimalist Status & Card Clear */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
              <Loader2 className="w-3 h-3 animate-spin text-zinc-500 dark:text-zinc-400" />
              <span className="text-[11px] font-mono">translating</span>
            </div>
          ) : isSource && text ? (
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              source
            </span>
          ) : null}

          {text && (
            <button
              onClick={onClearCard}
              title={`Clear ${meta.name}`}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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
          className="auto-expand-textarea w-full bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 text-[15px] sm:text-base leading-relaxed focus:outline-none transition-colors duration-100"
        />

        {/* Minimal Voice Dictation Indicator */}
        {isListening && (
          <div className="absolute inset-0 bg-white/95 dark:bg-zinc-900/95 rounded-b-3xl backdrop-blur-xs flex items-center justify-center gap-2 text-xs text-zinc-800 dark:text-zinc-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Listening in {meta.name}... Speak now
          </div>
        )}
      </div>

      {/* Refined Bottom Actions */}
      <div className="px-5 py-3 bg-zinc-50/70 dark:bg-zinc-950/40 rounded-b-3xl border-t border-zinc-100 dark:border-white/5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* Copy Button */}
          <button
            onClick={onCopy}
            disabled={!text}
            title={isCopied ? 'Copied' : `Copy ${meta.name}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              isCopied
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                : text
                ? 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 cursor-pointer active:scale-98'
                : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] font-medium">Copied</span>
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
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              isSpeaking
                ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-200/80 dark:bg-zinc-800'
                : text
                ? 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 cursor-pointer active:scale-98'
                : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
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
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              isListening
                ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 cursor-pointer active:scale-98'
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
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 dark:text-zinc-500 select-none">
          <span>{wordCount}w</span>
          <span>/</span>
          <span>{charCount}c</span>
        </div>
      </div>
    </div>
  );
};
