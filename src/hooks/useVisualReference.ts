import { useState, useEffect, useRef } from 'react';
import {
  fetchVisualReference,
  extractSearchTerm,
  type VisualReferenceResult,
} from '../services/visualReference';
import type { TranslationState, LanguageCode, IndustryCategory } from '../types';

export function useVisualReference(
  texts: TranslationState,
  activeSource: LanguageCode | null
) {
  const [data, setData] = useState<VisualReferenceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<IndustryCategory>('auto');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // 1. Determine active query from what the user is typing or the translated text
    const activeText = activeSource ? texts[activeSource] : '';
    const englishText = texts.en || '';

    // Choose the best candidate query
    const candidateRaw =
      (englishText.trim().length > 1 ? englishText : '') ||
      (activeText.trim().length > 1 ? activeText : '') ||
      Object.values(texts).find((t) => t.trim().length > 1) ||
      '';

    const candidate = extractSearchTerm(candidateRaw);

    // Cancel any previous debounce timer or ongoing fetch
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (abortRef.current) {
      abortRef.current.abort();
    }

    // 2. If all text boxes are empty or cleared, immediately show placeholder
    if (!candidate || candidate.length < 2) {
      setData(null);
      setIsLoading(false);
      setSearchTerm('');
      return;
    }

    // 3. Mark loading and set the searched term
    setSearchTerm(candidate);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    // 4. Debounce by 500ms to avoid spamming requests while typing
    timerRef.current = setTimeout(async () => {
      try {
        const result = await fetchVisualReference(candidate, category, controller.signal);
        setData(result);
        setIsLoading(false);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.warn('Visual reference fetch failed:', err);
          setIsLoading(false);
        }
      }
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [texts, activeSource, category]);

  return {
    data,
    isLoading,
    searchTerm,
    category,
    setCategory,
  };
}
