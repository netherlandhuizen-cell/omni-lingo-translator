import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Trash2,
  Shuffle,
  Volume2,
  Copy,
  Check,
  Search,
  Sparkles,
  Plus,
  Layers,
  BookOpen,
  X,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import type { Flashcard, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

interface StudyDeckProps {
  flashcards: Flashcard[];
  currentIndex: number;
  currentCard?: Flashcard;
  isFlipped: boolean;
  promptLanguage: LanguageCode | 'auto';
  onSetPromptLanguage: (lang: LanguageCode | 'auto') => void;
  onFlip: () => void;
  onNext: () => void;
  onPrev: () => void;
  onGoToCard: (index: number) => void;
  onShuffle: () => void;
  onRemoveCard: (id: string) => void;
  onResetToStarter: () => void;
  onAddCustomCard: (card: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  onSwitchToWorkspace: () => void;
}

const DEFAULT_DISPLAY_LANGS: LanguageCode[] = ['en', 'de', 'nl', 'id'];

const getCategoryLabel = (cat?: string) => {
  if (!cat) return null;
  switch (cat.toLowerCase()) {
    case 'office':
      return '💼 Office Life';
    case 'travel':
      return '✈️ Travel & Logistics';
    case 'nature':
      return '🌿 Nature & Environment';
    case 'tools':
      return '🔧 Technical & Tools';
    case 'construction':
      return '🏗️ Heavy Construction';
    case 'manufacturing':
      return '⚙️ Manufacturing';
    case 'electrical':
      return '⚡ Electrical';
    case 'laboratory':
      return '🔬 Laboratory';
    default:
      return cat;
  }
};

export const StudyDeck: React.FC<StudyDeckProps> = ({
  flashcards,
  currentIndex,
  currentCard,
  isFlipped,
  promptLanguage,
  onSetPromptLanguage,
  onFlip,
  onNext,
  onPrev,
  onGoToCard,
  onShuffle,
  onRemoveCard,
  onResetToStarter,
  onAddCustomCard,
  onSwitchToWorkspace,
}) => {
  const [copiedLang, setCopiedLang] = useState<string | null>(null);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New card form state
  const [newEn, setNewEn] = useState('');
  const [newDe, setNewDe] = useState('');
  const [newNl, setNewNl] = useState('');
  const [newId, setNewId] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('');

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        onFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFlip, onNext, onPrev]);

  const handleSpeak = (text: string, lang: LanguageCode) => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const key = `${lang}-${text}`;
    if (speakingKey === key) {
      setSpeakingKey(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const meta = SUPPORTED_LANGUAGES[lang];
    utterance.lang = meta?.speechCode || 'en-US';
    utterance.rate = 0.95;

    utterance.onstart = () => setSpeakingKey(key);
    utterance.onend = () => setSpeakingKey(null);
    utterance.onerror = () => setSpeakingKey(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = async (text: string, lang: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLang(lang);
      setTimeout(() => setCopiedLang(null), 1800);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEn.trim() && !newId.trim() && !newDe.trim() && !newNl.trim()) return;

    const primaryLang: LanguageCode = newEn.trim()
      ? 'en'
      : newId.trim()
      ? 'id'
      : newNl.trim()
      ? 'nl'
      : 'de';
    const primaryTerm =
      newEn.trim() || newId.trim() || newNl.trim() || newDe.trim();

    onAddCustomCard({
      primaryTerm,
      primaryLang,
      translations: {
        en: newEn.trim() || primaryTerm,
        de: newDe.trim() || primaryTerm,
        nl: newNl.trim() || primaryTerm,
        id: newId.trim() || primaryTerm,
      },
      visual: newImage.trim()
        ? {
            title: primaryTerm,
            description: newDesc.trim() || 'Custom vocabulary entry',
            imageUrl: newImage.trim(),
            category: 'construction',
          }
        : newDesc.trim()
        ? {
            title: primaryTerm,
            description: newDesc.trim(),
            imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
            category: 'construction',
          }
        : undefined,
      notes: newDesc.trim(),
    });

    setNewEn('');
    setNewDe('');
    setNewNl('');
    setNewId('');
    setNewDesc('');
    setNewImage('');
    setIsAddModalOpen(false);
  };

  const totalCards = flashcards.length;

  if (totalCards === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-2xl max-w-lg w-full flex flex-col items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <BookOpen className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Study Deck is Empty</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
            Save technical vocabulary from the Live Workspace with the bookmark button, or restore our curated technical starter pack!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onResetToStarter}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Starter Deck</span>
            </button>
            <button
              onClick={onSwitchToWorkspace}
              className="px-4 py-2 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-white/60 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <span>Back to Live Workspace</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine active front language & term
  const effectiveFrontLang: LanguageCode =
    promptLanguage === 'auto'
      ? currentCard?.primaryLang || 'en'
      : promptLanguage;

  const frontTerm =
    currentCard?.translations[effectiveFrontLang] ||
    currentCard?.primaryTerm ||
    '';
  const frontMeta =
    SUPPORTED_LANGUAGES[effectiveFrontLang] || SUPPORTED_LANGUAGES.en;

  // Determine languages to show on the back (at least en, de, nl, id)
  const backLanguages: LanguageCode[] = Array.from(
    new Set([
      ...DEFAULT_DISPLAY_LANGS,
      ...(currentCard ? (Object.keys(currentCard.translations) as LanguageCode[]) : []),
    ])
  ).slice(0, 6);

  const googleImageSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
    currentCard?.primaryTerm || frontTerm || 'equipment'
  )}`;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Top Deck Studio Toolbar */}
      <div className="w-full mb-5 flex flex-wrap items-center justify-between gap-3 px-2 sm:px-0">
        {/* Progress & Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/60 dark:border-white/10 text-xs font-mono font-bold text-slate-800 dark:text-emerald-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Card {currentIndex + 1} of {totalCards}
            </span>
          </div>

          {/* Quick Progress Bar */}
          <div className="w-24 sm:w-36 h-2 rounded-full bg-slate-200/60 dark:bg-slate-800/60 overflow-hidden hidden sm:block">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
            />
          </div>
        </div>

        {/* Study Front Language Selector & Studio Tools */}
        <div className="flex items-center gap-2">
          {/* Front Language Dropdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/60 dark:border-white/10 text-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Front:</span>
            <select
              value={promptLanguage}
              onChange={(e) => onSetPromptLanguage(e.target.value as LanguageCode | 'auto')}
              className="bg-transparent font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="auto" className="bg-slate-900 text-white">Auto (Source)</option>
              <option value="en" className="bg-slate-900 text-white">🇺🇸 English</option>
              <option value="de" className="bg-slate-900 text-white">🇩🇪 German</option>
              <option value="nl" className="bg-slate-900 text-white">🇳🇱 Dutch</option>
              <option value="id" className="bg-slate-900 text-white">🇮🇩 Indonesian</option>
            </select>
          </div>

          {/* Shuffle Deck */}
          <button
            onClick={onShuffle}
            title="Shuffle deck for active recall"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/40 dark:bg-slate-900/40 hover:bg-emerald-500/20 text-slate-800 dark:text-slate-200 hover:text-emerald-500 border border-white/60 dark:border-white/10 shadow-md transition-all cursor-pointer active:scale-95 text-xs font-bold"
          >
            <Shuffle className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          {/* View All Deck Cards */}
          <button
            onClick={() => setIsOverviewOpen(true)}
            title="Deck overview & cards list"
            className="p-1.5 rounded-xl bg-white/40 dark:bg-slate-900/40 hover:bg-white/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-500 border border-white/60 dark:border-white/10 shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Add Custom Card */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            title="Add a custom vocabulary card"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Card</span>
          </button>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="w-full max-w-2xl perspective-1000 min-h-[460px] sm:min-h-[480px] relative select-none">
        <div
          onClick={onFlip}
          className={`w-full h-full min-h-[460px] sm:min-h-[480px] relative transition-transform duration-500 transform-style-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ======================================================== */}
          {/* CARD FRONT: Single Language Term + Visual Reference      */}
          {/* ======================================================== */}
          <div className="backface-hidden w-full h-full min-h-[460px] sm:min-h-[480px] rounded-3xl backdrop-blur-xl bg-white/55 dark:bg-slate-900/50 border border-white/60 dark:border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/50 transition-colors group">
            {/* Top Bar on Front */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl drop-shadow-xs">{frontMeta.flag}</span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg bg-white/40 dark:bg-slate-800/80 border border-white/50 dark:border-white/10">
                  {frontMeta.name} ({frontMeta.code.toUpperCase()})
                </span>
                {currentCard?.visual?.category && (
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hidden sm:inline">
                    {getCategoryLabel(currentCard.visual.category)}
                  </span>
                )}
              </div>

              {/* Pronounce & Google Images */}
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => handleSpeak(frontTerm, effectiveFrontLang)}
                  title={`Pronounce in ${frontMeta.name}`}
                  className="p-2 rounded-xl text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-300 bg-white/50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-white/40 dark:border-white/10 transition-all cursor-pointer active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center: Visual Thumbnail & High-Impact Vocabulary Word */}
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
              {currentCard?.visual?.imageUrl && (
                <div className="relative mb-5 w-44 h-32 sm:w-56 sm:h-36 rounded-2xl overflow-hidden border border-white/40 dark:border-white/10 shadow-xl group-hover:scale-102 transition-transform duration-300">
                  <img
                    src={currentCard.visual.imageUrl}
                    alt={currentCard.visual.title || frontTerm}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  {currentCard.visual.title && (
                    <span className="absolute bottom-2 left-2 right-2 text-[11px] text-white/90 font-medium truncate text-center drop-shadow">
                      {currentCard.visual.title}
                    </span>
                  )}
                </div>
              )}

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-2 drop-shadow-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                {frontTerm || '—'}
              </h2>

              {currentCard?.notes && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md line-clamp-2">
                  {currentCard.notes}
                </p>
              )}
            </div>

            {/* Bottom Bar on Front: Flip Hint */}
            <div className="pt-4 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <RotateCw className="w-3.5 h-3.5 text-emerald-500 animate-spin-slow" />
                <span>Click card or press Space to reveal translations</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                Flip ➔
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD BACK: 4-Way Language Breakdown (Rotated 180 deg)    */}
          {/* ======================================================== */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 w-full h-full min-h-[460px] sm:min-h-[480px] rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 border border-emerald-500/50 dark:border-emerald-400/40 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            {/* Top Bar on Back */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950 dark:text-white leading-tight">
                    Nusantara 4-Way Breakdown
                  </h3>
                  <p className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                    Synchronized Vocabulary
                  </p>
                </div>
              </div>

              {/* Direct Google Images helper button */}
              <a
                href={googleImageSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-300 text-xs font-semibold border border-white/60 dark:border-white/10 shadow-sm transition-all"
              >
                <Search className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Google Images</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            {/* Translation Slots Grid (All 4 Core Languages) */}
            <div className="my-auto py-3 grid grid-cols-1 sm:grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
              {backLanguages.map((code) => {
                const meta = SUPPORTED_LANGUAGES[code];
                if (!meta) return null;
                const value = currentCard?.translations[code] || '—';
                const isCopied = copiedLang === code;

                return (
                  <div
                    key={`back-lang-${code}`}
                    className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-950/40 border border-white/60 dark:border-white/10 hover:border-emerald-500/40 transition-colors flex flex-col justify-between gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base leading-none">{meta.flag}</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {meta.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 uppercase">
                          {code}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Audio Speak */}
                        <button
                          type="button"
                          onClick={() => handleSpeak(value, code)}
                          disabled={!value || value === '—'}
                          title={`Pronounce in ${meta.name}`}
                          className="p-1 rounded-lg text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>

                        {/* One-click Copy */}
                        <button
                          type="button"
                          onClick={() => handleCopy(value, code)}
                          disabled={!value || value === '—'}
                          title={`Copy ${meta.name} word`}
                          className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-base sm:text-lg font-black text-slate-950 dark:text-white truncate">
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Bar on Back: Flip Back Hint */}
            <div className="pt-3 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <RotateCw className="w-3.5 h-3.5 text-emerald-500" />
                <span>Click card to flip back to front</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                ↺ Front
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bottom Deck Controls */}
      <div className="w-full max-w-2xl mt-5 flex items-center justify-between gap-3 px-2 sm:px-0">
        {/* Previous Card */}
        <button
          onClick={onPrev}
          title="Previous Card (Left Arrow)"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-300 text-xs font-bold backdrop-blur-md border border-white/60 dark:border-white/10 shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Center: Flip, Shuffle & Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Flip Button */}
          <button
            onClick={onFlip}
            title="Flip Card (Space)"
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95"
          >
            <RotateCw className="w-4 h-4" />
            <span>{isFlipped ? 'Show Front' : 'Flip Card'}</span>
          </button>

          {/* Prominent Shuffle Deck Button */}
          <button
            onClick={onShuffle}
            title="Randomize card order for active recall"
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 border border-white/60 dark:border-emerald-500/30 text-xs font-bold shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <Shuffle className="w-4 h-4 text-emerald-500" />
            <span>Shuffle</span>
          </button>

          {/* Remove from Deck */}
          {currentCard && (
            <button
              onClick={() => onRemoveCard(currentCard.id)}
              title="Remove this card from study deck"
              className="p-2.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 border border-white/60 dark:border-white/10 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Next Card */}
        <button
          onClick={onNext}
          title="Next Card (Right Arrow)"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-300 text-xs font-bold backdrop-blur-md border border-white/60 dark:border-white/10 shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODAL: Deck Overview (View All Cards List)              */}
      {/* ======================================================== */}
      {isOverviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col rounded-3xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Deck Overview ({totalCards} Cards)
                </h3>
              </div>
              <button
                onClick={() => setIsOverviewOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Card List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
              {flashcards.map((c, idx) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onGoToCard(idx);
                    setIsOverviewOpen(false);
                  }}
                  className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 border transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'bg-emerald-500/15 border-emerald-500/50 ring-1 ring-emerald-500/30'
                      : 'bg-white/40 dark:bg-slate-950/40 border-white/60 dark:border-white/10 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-slate-400 w-5">
                      {idx + 1}.
                    </span>
                    {c.visual?.imageUrl && (
                      <img
                        src={c.visual.imageUrl}
                        alt={c.primaryTerm}
                        className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
                        {c.primaryTerm}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {[
                          c.translations.en && `EN: ${c.translations.en}`,
                          c.translations.de && `DE: ${c.translations.de}`,
                          c.translations.nl && `NL: ${c.translations.nl}`,
                          c.translations.id && `ID: ${c.translations.id}`,
                        ]
                          .filter(Boolean)
                          .join(' • ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCard(c.id);
                      }}
                      title="Remove card"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
              <button
                onClick={onResetToStarter}
                className="text-slate-500 hover:text-emerald-500 font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Starter Deck</span>
              </button>
              <button
                onClick={() => setIsOverviewOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Add Custom Flashcard                             */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Add Custom Flashcard
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    🇺🇸 English
                  </label>
                  <input
                    type="text"
                    value={newEn}
                    onChange={(e) => setNewEn(e.target.value)}
                    placeholder="e.g. Generator"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    🇩🇪 German
                  </label>
                  <input
                    type="text"
                    value={newDe}
                    onChange={(e) => setNewDe(e.target.value)}
                    placeholder="e.g. Generator / Stromerzeuger"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    🇳🇱 Dutch
                  </label>
                  <input
                    type="text"
                    value={newNl}
                    onChange={(e) => setNewNl(e.target.value)}
                    placeholder="e.g. Stroomaggregaat"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    🇮🇩 Indonesian
                  </label>
                  <input
                    type="text"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    placeholder="e.g. Genset Listrik"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Technical Note / Description (Optional)
                </label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Portable auxiliary diesel power generator"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
