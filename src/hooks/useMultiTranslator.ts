import { useState, useRef, useCallback, useEffect } from 'react';
import type { LanguageCode, TranslationState, LoadingState, EngineSettings } from '../types';
import { translateText } from '../services/translator';
import { SUPPORTED_LANGUAGES, LANGUAGE_KEYS } from '../constants/languages';

const INITIAL_TEXTS: TranslationState = {
  en: '',
  de: '',
  nl: '',
  id: '',
};

const INITIAL_LOADING: LoadingState = {
  en: false,
  de: false,
  nl: false,
  id: false,
};

const DEFAULT_SETTINGS: EngineSettings = {
  provider: 'mymemory',
  myMemoryEmail: '',
  libreTranslateUrl: 'https://libretranslate.com',
  libreTranslateKey: '',
  deepLKey: '',
  debounceMs: 380,
};

export function useMultiTranslator() {
  const [texts, setTexts] = useState<TranslationState>(() => {
    return INITIAL_TEXTS;
  });

  const [loading, setLoading] = useState<LoadingState>(INITIAL_LOADING);
  const [activeSource, setActiveSource] = useState<LanguageCode | null>(null);
  const [copiedLang, setCopiedLang] = useState<LanguageCode | null>(null);
  const [speakingLang, setSpeakingLang] = useState<LanguageCode | null>(null);
  const [listeningLang, setListeningLang] = useState<LanguageCode | null>(null);
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
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    activeSourceRef.current = activeSource;
  }, [activeSource]);

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
      const targetLangs = LANGUAGE_KEYS.filter((l) => l !== sourceLang);

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
      setActiveSource(lang);
      activeSourceRef.current = lang;

      setTexts((prev) => ({
        ...prev,
        [lang]: value,
      }));

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (!value.trim()) {
        setTexts(INITIAL_TEXTS);
        setLoading(INITIAL_LOADING);
        return;
      }

      setLoading((prev) => {
        const next = { ...prev };
        LANGUAGE_KEYS.forEach((l) => {
          next[l] = l !== lang;
        });
        return next;
      });

      debounceTimerRef.current = setTimeout(() => {
        triggerTranslation(lang, value);
      }, settings.debounceMs);
    },
    [settings.debounceMs, triggerTranslation]
  );

  const handleSetSample = useCallback(
    (lang: LanguageCode, text: string) => {
      setActiveSource(lang);
      activeSourceRef.current = lang;
      setTexts((prev) => ({
        ...prev,
        [lang]: text,
      }));

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      triggerTranslation(lang, text);
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

  const handleCopy = useCallback(async (lang: LanguageCode) => {
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
  }, [texts]);

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
      utterance.lang = SUPPORTED_LANGUAGES[lang].speechCode;
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
        alert('Voice speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
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
      recognition.lang = SUPPORTED_LANGUAGES[lang].speechCode;
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
    handleTextChange,
    handleClearAll,
    handleCopy,
    handleSpeak,
    handleToggleVoiceInput,
    handleSetSample,
  };
}
