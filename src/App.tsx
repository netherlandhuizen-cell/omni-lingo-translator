import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TranslationCard } from './components/TranslationCard';
import { QuickPhrases } from './components/QuickPhrases';
import { SettingsModal } from './components/SettingsModal';
import { useMultiTranslator } from './hooks/useMultiTranslator';
import { LANGUAGE_KEYS } from './constants/languages';
import type { LanguageCode } from './types';
import {
  ArrowRightLeft,
  Volume2,
  Cpu,
  Layers,
} from 'lucide-react';

export function App() {
  const {
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
  } = useMultiTranslator();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_preference');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to root document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_preference', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_preference', 'light');
    }
  }, [isDarkMode]);

  const hasAnyContent = Object.values(texts).some((val) => val.trim().length > 0);

  const handleClearSingleCard = (lang: LanguageCode) => {
    if (lang === activeSource) {
      handleClearAll();
    } else {
      handleTextChange(lang, '');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header
        activeSource={activeSource}
        hasContent={hasAnyContent}
        onClearAll={handleClearAll}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col justify-start">
        {/* Quick Sample Phrases Bar */}
        <QuickPhrases onSelectPhrase={handleSetSample} />

        {/* 2x2 Grid of the 4 Interactive Language Cards */}
        <section
          aria-label="Quad Language Translation Workspace"
          className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8"
        >
          {LANGUAGE_KEYS.map((langKey) => (
            <TranslationCard
              key={langKey}
              lang={langKey}
              text={texts[langKey]}
              isLoading={loading[langKey]}
              isSource={activeSource === langKey}
              isCopied={copiedLang === langKey}
              isSpeaking={speakingLang === langKey}
              isListening={listeningLang === langKey}
              onChange={(value) => handleTextChange(langKey, value)}
              onCopy={() => handleCopy(langKey)}
              onSpeak={() => handleSpeak(langKey)}
              onVoiceInput={() => handleToggleVoiceInput(langKey)}
              onClearCard={() => handleClearSingleCard(langKey)}
            />
          ))}
        </section>

        {/* Informational Feature Highlights */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-auto pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <ArrowRightLeft className="w-4 h-4" />
              <span>Bidirectional Real-Time</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Type or paste into <strong>any</strong> of the 4 boxes — immediately synchronizes the remaining three.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Loop-Free Caret State</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Direct synchronous typing prevents cursor hopping, lag, or recursive translation feedback loops.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Multi-Tier Engine</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Free MyMemory API with instant LRU cache and offline phrase dictionary fallback.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5 text-amber-600 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <Volume2 className="w-4 h-4" />
              <span>Speech & Dictation</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Listen to native pronunciations or dictate using your microphone in all 4 languages.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span>Engine:</span>
          <span className="font-semibold text-slate-600 dark:text-slate-400 capitalize">
            {settings.provider === 'mymemory' ? 'MyMemory Public API' : settings.provider}
          </span>
          <span>•</span>
          <span>Languages: EN 🇺🇸, DE 🇩🇪, NL 🇳🇱, ID 🇮🇩</span>
        </div>

        <div className="flex items-center gap-1">
          <span>Crafted for high-performance real-time translation</span>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />
    </div>
  );
}

export default App;
