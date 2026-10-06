import { useState, useEffect, useRef } from 'react';
import {
  fetchVisualReference,
  extractSearchTerm,
  type VisualReferenceResult,
} from '../services/visualReference';

export function useVisualReference(primaryText: string, fallbackText: string) {
  const [data, setData] = useState<VisualReferenceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Choose candidate term: preferably English translation as it works best for global visual search,
    // otherwise fallback to whatever active source text was typed
    const candidate = extractSearchTerm(primaryText) || extractSearchTerm(fallbackText);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (abortRef.current) {
      abortRef.current.abort();
    }

    if (!candidate || candidate.length < 2) {
      setData(null);
      setIsLoading(false);
      setSearchTerm('');
      return;
    }

    setSearchTerm(candidate);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    // Debounce image fetching at 550ms to stay decoupled from instant text typing
    timerRef.current = setTimeout(async () => {
      try {
        const result = await fetchVisualReference(candidate, controller.signal);
        setData(result);
        setIsLoading(false);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.warn('Visual reference error:', err);
          setIsLoading(false);
        }
      }
    }, 550);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [primaryText, fallbackText]);

  return {
    data,
    isLoading,
    searchTerm,
  };
}
