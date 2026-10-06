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
      <span className="text-zinc-400 dark:text-zinc-500 font-medium select-none mr-1">
        Try:
      </span>

      {SAMPLE_ITEMS.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelectPhrase(item.lang, item.phrase)}
          className="px-2.5 py-1 rounded-md bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all duration-150 cursor-pointer active:scale-98 truncate max-w-[260px] sm:max-w-none"
        >
          {item.phrase}
        </button>
      ))}
    </div>
  );
};
