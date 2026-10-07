import React from 'react';
import type { LanguageCode } from '../types';

interface QuickPhrasesProps {
  onSelectPhrase: (lang: LanguageCode, phrase: string) => void;
}

const SAMPLE_ITEMS: Array<{
  lang: LanguageCode;
  phrase: string;
}> = [
  {
    lang: 'en',
    phrase: 'Good morning! How are you doing today?',
  },
  {
    lang: 'de',
    phrase: 'Wo ist der nächste Bahnhof und wie komme ich dorthin?',
  },
  {
    lang: 'nl',
    phrase: 'Aangenaam kennis te maken, welkom bij ons team!',
  },
  {
    lang: 'id',
    phrase: 'Selamat pagi! Semoga harimu menyenangkan dan produktif.',
  },
  {
    lang: 'en',
    phrase: 'Simultaneous translation makes global collaboration effortless.',
  },
];

export const QuickPhrases: React.FC<QuickPhrasesProps> = ({ onSelectPhrase }) => {
  return (
    <div className="w-full flex flex-wrap items-center gap-2 mb-6 text-xs">
      <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px] select-none mr-1 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        Quick Prompts:
      </span>

      {SAMPLE_ITEMS.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelectPhrase(item.lang, item.phrase)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/65 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-amber-400/50 dark:hover:border-amber-400/40 text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs truncate max-w-[280px] sm:max-w-none group"
        >
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-amber-400 font-bold uppercase group-hover:bg-amber-500/20 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
            {item.lang}
          </span>
          <span className="truncate">{item.phrase}</span>
        </button>
      ))}
    </div>
  );
};
