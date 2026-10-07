import { useState, useRef, useCallback, useEffect } from 'react';
import type { LanguageCode, TranslationState, LoadingState, EngineSettings } from '../types';
import { translateText } from '../services/translator';
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_SLOT_LANGUAGES,
  ALL_LANGUAGES,
} from '../constants/languages';

const INITIAL_TEXTS: TranslationState = ALL_LANGUAGES.reduce((acc, lang) => {
  acc[lang] = '';
  return acc;
}, {} as TranslationState);

const INITIAL_LOADING: LoadingState = ALL_LANGUAGES.reduce((acc, lang) => {
  acc[lang] = false;
  return acc;
}, {} as LoadingState);

const DEFAULT_SETTINGS: EngineSettings = {
  provider: 'mymemory',
  myMemoryEmail: '',
  libreTranslateUrl: 'https://libretranslate.com',
  libreTranslateKey: '',
  deepLKey: '',
  debounceMs: 380,
};

export function useMultiTranslator() {
  const [texts, setTexts] = useState<TranslationState>(() => INITIAL_TEXTS);
  const [loading, setLoading] = useState<LoadingState>(INITIAL_LOADING);
  const [activeSource, setActiveSource] = useState<LanguageCode | null>(null);
  const [copiedLang, setCopiedLang] = useState<LanguageCode | null>(null);
  const [speakingLang, setSpeakingLang] = useState<LanguageCode | null>(null);
  const [listeningLang, setListeningLang] = useState<LanguageCode | null>(null);

  // 4 dynamic language slots
  const [slotLanguages, setSlotLanguages] = useState<
    [LanguageCode, LanguageCode, LanguageCode, LanguageCode]
  >(() => {
    try {
      const saved = localStorage.getItem('omni_slot_languages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) {
          return parsed as [LanguageCode, LanguageCode, LanguageCode, LanguageCode];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SLOT_LANGUAGES;
  });

  const [settings, setSettings] = useState<EngineSettings>(() => {
    try {
      const saved = localStorage.getItem('translator_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeSourceRef = useRef<LanguageCode | null>(null);
  const slotLanguagesRef = useRef<[LanguageCode, LanguageCode, LanguageCode, LanguageCode]>(
    slotLanguages
  );
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    activeSourceRef.current = activeSource;
  }, [activeSource]);

  useEffect(() => {
    slotLanguagesRef.current = slotLanguages;
    try {
      localStorage.setItem('omni_slot_languages', JSON.stringify(slotLanguages));
    } catch (e) {
      console.error(e);
    }
  }, [slotLanguages]);

  useEffect(() => {
    try {
      localStorage.setItem('translator_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const triggerTranslation = useCallback(
    (sourceLang: LanguageCode, sourceText: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const trimmed = sourceText.trim();
      const currentSlots = slotLanguagesRef.current;
      const targetLangs = currentSlots.filter((l) => l !== sourceLang);

      if (!trimmed) {
        setTexts((prev) => {
          const next = { ...prev };
          targetLangs.forEach((l) => (next[l] = ''));
          return next;
        });
        setLoading(INITIAL_LOADING);
        return;
      }

      setLoading((prev) => {
        const next = { ...prev };
        targetLangs.forEach((l) => (next[l] = true));
        next[sourceLang] = false;
        return next;
      });

      targetLangs.forEach(async (targetLang) => {
        try {
          const translated = await translateText(
            sourceText,
            sourceLang,
            targetLang,
            settings,
            controller.signal
          );

          if (activeSourceRef.current === sourceLang) {
            setTexts((prev) => ({
              ...prev,
              [targetLang]: translated,
            }));
            setLoading((prev) => ({
              ...prev,
              [targetLang]: false,
            }));
          }
        } catch (err: any) {
          if (err?.name !== 'AbortError') {
            console.error(`Translation error [${sourceLang} -> ${targetLang}]:`, err);
            if (activeSourceRef.current === sourceLang) {
              setLoading((prev) => ({
                ...prev,
                [targetLang]: false,
              }));
            }
          }
        }
      });
    },
    [settings]
  );

  const handleTextChange = useCallback(
    (lang: LanguageCode, value: string) => {
      // Enforce 1,000 character limit
      const safeValue = value.length > 1000 ? value.slice(0, 1000) : value;

      setActiveSource(lang);
      activeSourceRef.current = lang;

      setTexts((prev) => ({
        ...prev,
        [lang]: safeValue,
      }));

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (!safeValue.trim()) {
        setTexts(INITIAL_TEXTS);
        setLoading(INITIAL_LOADING);
        return;
      }

      const currentSlots = slotLanguagesRef.current;
      setLoading((prev) => {
        const next = { ...prev };
        currentSlots.forEach((l) => {
          next[l] = l !== lang;
        });
        return next;
      });

      debounceTimerRef.current = setTimeout(() => {
        triggerTranslation(lang, safeValue);
      }, settings.debounceMs);
    },
    [settings.debounceMs, triggerTranslation]
  );

  const handleSlotLanguageChange = useCallback(
    (slotIndex: number, newLang: LanguageCode) => {
      setSlotLanguages((prev) => {
        const next: [LanguageCode, LanguageCode, LanguageCode, LanguageCode] = [...prev];
        const oldLang = next[slotIndex];

        if (oldLang === newLang) return prev;

        const existingSlotIndex = next.indexOf(newLang);
        if (existingSlotIndex !== -1) {
          // Swap positions so every box has a distinct language
          next[existingSlotIndex] = oldLang;
          next[slotIndex] = newLang;
        } else {
          next[slotIndex] = newLang;
        }

        return next;
      });

      // If active source text exists, translate into the new language right away
      const currentSource = activeSourceRef.current;
      if (currentSource && texts[currentSource]?.trim()) {
        const sourceText = texts[currentSource];
        if (currentSource !== newLang) {
          setLoading((prev) => ({ ...prev, [newLang]: true }));

          translateText(sourceText, currentSource, newLang, settings)
            .then((translated) => {
              setTexts((prev) => ({ ...prev, [newLang]: translated }));
            })
            .catch((err) => {
              console.error(`Translation failed on language switch [${currentSource} -> ${newLang}]:`, err);
            })
            .finally(() => {
              setLoading((prev) => ({ ...prev, [newLang]: false }));
            });
        }
      }
    },
    [texts, settings]
  );

  const handleSetSample = useCallback(
    (lang: LanguageCode, text: string) => {
      const safeText = text.length > 1000 ? text.slice(0, 1000) : text;
      setActiveSource(lang);
      activeSourceRef.current = lang;

      setTexts((prev) => ({
        ...prev,
        [lang]: safeText,
      }));

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      triggerTranslation(lang, safeText);
    },
    [triggerTranslation]
  );

  const handleClearAll = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    setTexts(INITIAL_TEXTS);
    setLoading(INITIAL_LOADING);
    setActiveSource(null);
    setSpeakingLang(null);
    setListeningLang(null);
  }, []);

  const handleCopy = useCallback(
    async (lang: LanguageCode) => {
      const textToCopy = texts[lang];
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopiedLang(lang);
        setTimeout(() => {
          setCopiedLang((current) => (current === lang ? null : current));
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    },
    [texts]
  );

  const handleSpeak = useCallback(
    (lang: LanguageCode) => {
      const textToSpeak = texts[lang];
      if (!textToSpeak || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();

      if (speakingLang === lang) {
        setSpeakingLang(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const meta = SUPPORTED_LANGUAGES[lang];
      utterance.lang = meta?.speechCode || 'en-US';
      utterance.rate = 0.95;

      utterance.onstart = () => {
        setSpeakingLang(lang);
      };

      utterance.onend = () => {
        setSpeakingLang(null);
      };

      utterance.onerror = () => {
        setSpeakingLang(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [texts, speakingLang]
  );

  const handleToggleVoiceInput = useCallback(
    (lang: LanguageCode) => {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert(
          'Voice speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.'
        );
        return;
      }

      if (listeningLang === lang && recognitionRef.current) {
        recognitionRef.current.stop();
        setListeningLang(null);
        return;
      }

      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      const meta = SUPPORTED_LANGUAGES[lang];
      recognition.lang = meta?.speechCode || 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setListeningLang(lang);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          handleTextChange(lang, transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setListeningLang(null);
      };

      recognition.onend = () => {
        setListeningLang(null);
      };

      recognition.start();
    },
    [listeningLang, handleTextChange]
  );

  return {
    texts,
    loading,
    activeSource,
    copiedLang,
    speakingLang,
    listeningLang,
    settings,
    setSettings,
    slotLanguages,
    handleSlotLanguageChange,
    handleTextChange,
    handleClearAll,
    handleCopy,
    handleSpeak,
    handleToggleVoiceInput,
    handleSetSample,
  };
}
