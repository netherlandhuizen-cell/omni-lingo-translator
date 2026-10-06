import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import type { LanguageCode } from '../types';

interface QuickPhrasesProps {
  onSelectPhrase: (lang: LanguageCode, phrase: string) => void;
}

const SAMPLE_ITEMS: Array<{
  lang: LanguageCode;
  label: string;
  phrase: string;
  flag: string;
}> = [
  {
    lang: 'en',
    label: 'Greeting',
    phrase: 'Good morning! How are you doing today?',
    flag: '🇺🇸',
  },
  {
    lang: 'de',
    label: 'Travel',
    phrase: 'Wo ist der nächste Bahnhof und wie komme ich dorthin?',
    flag: '🇩🇪',
  },
  {
    lang: 'nl',
    label: 'Meeting',
    phrase: 'Aangenaam kennis te maken, welkom bij ons team!',
    flag: '🇳🇱',
  },
  {
    lang: 'id',
    label: 'Friendly',
    phrase: 'Selamat pagi! Semoga harimu menyenangkan dan penuh semangat.',
    flag: '🇮🇩',
  },
  {
    lang: 'en',
    label: 'Tech',
    phrase: 'Artificial intelligence is transforming real-time communication.',
    flag: '🇺🇸',
  },
];

export const QuickPhrases: React.FC<QuickPhrasesProps> = ({ onSelectPhrase }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-6">
      <div className="flex items-center gap-2 mb-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
        <span>Try Quick Examples (Click to translate)</span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {SAMPLE_ITEMS.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectPhrase(item.lang, item.phrase)}
            className="flex-shrink-0 group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
          >
            <span className="text-sm">{item.flag}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 group-hover:text-indigo-500">
              {item.label}
            </span>
            <span className="truncate max-w-[200px] sm:max-w-[280px]">
              "{item.phrase}"
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};
