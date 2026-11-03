import { useState, useEffect, useCallback, useRef } from 'react';
import type { Flashcard, LanguageCode, IndustryCategory } from '../types';
import { getRandomPackageDeck, shuffleArray } from '../constants/starterDeck';
import type { VisualReferenceResult } from '../services/visualReference';

const CURRENT_STORAGE_KEY = 'akehboso_multitopic_study_deck_v6';
const OBSOLETE_STORAGE_KEYS = [
  'akehboso_study_deck',
  'akehboso_study_deck_v2',
  'akehboso_study_deck_v3',
  'akehboso_daily_study_deck_v4',
  'akehboso_pure_daily_study_deck_v5',
];

const CONSTRUCTION_JARGON_TERMS = [
  'excavator',
  'bagger',
  'graafmachine',
  'ekskavator',
  'bulldozer',
  'buldoser',
  'planierraupe',
  'crane',
  'turmkran',
  'baukran',
  'bouwkraan',
  'derek',
  'screwdriver',
  'schraubendreher',
  'schroevendraaier',
  'obeng',
  'welding',
  'schweißgerät',
  'lasapparaat',
  'mesin las',
  'multimeter',
  'oscilloscope',
  'oszilloskop',
  'helmet',
  'schutzhelm',
  'veiligheidshelm',
  'helm keselamatan',
  'wrench',
  'circuit',
  'blueprint',
  'pressure gauge',
  'manometer',
  'drukmeter',
  'forklift',
  'gabelstapler',
  'vorkheftruck',
  'lathe',
  'centrifuge',
];

function isObsoleteOrConstructionCard(c: Flashcard): boolean {
  if (!c) return false;
  // Any legacy starter or master id from old construction decks
  if (c.id && (c.id.startsWith('starter-') || c.id.startsWith('master-'))) {
    return true;
  }
  const textBlob = [
    c.primaryTerm,
    c.visual?.title,
    c.visual?.category,
    ...Object.values(c.translations || {}),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return CONSTRUCTION_JARGON_TERMS.some((term) => textBlob.includes(term));
}

export function useFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    if (typeof window === 'undefined') return getRandomPackageDeck(20);

    // Clean up all obsolete legacy storage keys from browser
    OBSOLETE_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (_) {}
    });

    try {
      const stored = localStorage.getItem(CURRENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If ANY construction card exists in stored deck, wipe it and load fresh pure daily deck
          const hasConstruction = parsed.some(isObsoleteOrConstructionCard);
          if (!hasConstruction && parsed.length >= 10) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse saved flashcards:', e);
    }

    const freshDailyDeck = getRandomPackageDeck(20);
    try {
      localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(freshDailyDeck));
    } catch (_) {}
    return freshDailyDeck;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [promptLanguage, setPromptLanguage] = useState<LanguageCode | 'auto'>('auto');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(flashcards));
    } catch (e) {
      console.error('Failed to save flashcards to localStorage:', e);
    }
  }, [flashcards]);

  // Ensure currentIndex stays within bounds
  useEffect(() => {
    if (flashcards.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= flashcards.length) {
      setCurrentIndex(Math.max(0, flashcards.length - 1));
    }
  }, [flashcards.length, currentIndex]);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  const flipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const nextCard = useCallback(() => {
    if (flashcards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  }, [flashcards.length]);

  const prevCard = useCallback(() => {
    if (flashcards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  }, [flashcards.length]);

  const goToCard = useCallback(
    (index: number) => {
      if (index >= 0 && index < flashcards.length) {
        setIsFlipped(false);
        setCurrentIndex(index);
      }
    },
    [flashcards.length]
  );

  const shuffleDeck = useCallback(() => {
    if (flashcards.length <= 1) return;
    setIsFlipped(false);
    setFlashcards((prev) => shuffleArray(prev));
    setCurrentIndex(0);
    showToast('Deck shuffled! Random active recall mode 🔀');
  }, [flashcards.length, showToast]);

  const saveToDeck = useCallback(
    (
      primaryLang: LanguageCode,
      allTexts: Record<LanguageCode, string>,
      visualData?: VisualReferenceResult | null
    ) => {
      const primaryTerm = (allTexts[primaryLang] || '').trim();
      if (!primaryTerm) {
        showToast('Type a word first to save to Study Deck.');
        return;
      }

      // Collect non-empty translations across languages
      const translations: Partial<Record<LanguageCode, string>> = {};
      (Object.keys(allTexts) as LanguageCode[]).forEach((l) => {
        const t = (allTexts[l] || '').trim();
        if (t) {
          translations[l] = t;
        }
      });

      // Ensure primaryLang is set
      translations[primaryLang] = primaryTerm;

      // Check if this term already exists in the deck
      const existingIdx = flashcards.findIndex(
        (c) =>
          c.primaryTerm.toLowerCase() === primaryTerm.toLowerCase() ||
          (c.translations[primaryLang] &&
            c.translations[primaryLang]?.toLowerCase() === primaryTerm.toLowerCase())
      );

      const visualInfo = visualData
        ? {
            title: visualData.title || primaryTerm,
            description: visualData.description,
            imageUrl: visualData.imageUrl || visualData.thumbnailUrl,
            category: visualData.category as IndustryCategory,
          }
        : undefined;

      if (existingIdx !== -1) {
        // Update existing card with fresh translations & visual data
        setFlashcards((prev) => {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            translations: { ...updated[existingIdx].translations, ...translations },
            visual: visualInfo || updated[existingIdx].visual,
            createdAt: Date.now(),
          };
          return updated;
        });
        showToast(`Updated "${primaryTerm}" in Study Deck! ⭐`);
      } else {
        const newCard: Flashcard = {
          id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: Date.now(),
          primaryTerm,
          primaryLang,
          translations,
          visual: visualInfo,
        };

        setFlashcards((prev) => [newCard, ...prev]);
        showToast(`Saved "${primaryTerm}" to Study Deck! 🎴`);
      }
    },
    [flashcards, showToast]
  );

  const removeCard = useCallback(
    (id: string) => {
      setFlashcards((prev) => prev.filter((c) => c.id !== id));
      setIsFlipped(false);
      showToast('Card removed from Study Deck');
    },
    [showToast]
  );

  const refreshPackage = useCallback(() => {
    // Preserve only real non-construction user custom cards
    const customUserCards = flashcards.filter(
      (c) =>
        c &&
        c.id &&
        c.id.startsWith('custom-') &&
        !isObsoleteOrConstructionCard(c)
    );
    const slotsNeeded = Math.max(0, 20 - customUserCards.length);
    const freshCards = getRandomPackageDeck(slotsNeeded > 0 ? slotsNeeded : 20);
    const nextDeck = [...customUserCards, ...freshCards];

    setFlashcards(nextDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
    showToast('Loaded fresh 20-card multi-topic package! 🔄');
  }, [flashcards, showToast]);

  const resetToStarterDeck = useCallback(() => {
    refreshPackage();
  }, [refreshPackage]);

  const addCustomCard = useCallback(
    (card: Omit<Flashcard, 'id' | 'createdAt'>) => {
      const newCard: Flashcard = {
        ...card,
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      };
      setFlashcards((prev) => [newCard, ...prev]);
      setCurrentIndex(0);
      setIsFlipped(false);
      showToast(`Added "${newCard.primaryTerm}" to deck! ✨`);
    },
    [showToast]
  );

  return {
    flashcards,
    currentIndex,
    currentCard: flashcards[currentIndex] as Flashcard | undefined,
    isFlipped,
    promptLanguage,
    setPromptLanguage,
    flipCard,
    nextCard,
    prevCard,
    goToCard,
    shuffleDeck,
    refreshPackage,
    saveToDeck,
    removeCard,
    resetToStarterDeck,
    addCustomCard,
    toastMessage,
    showToast,
  };
}
