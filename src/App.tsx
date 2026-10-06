import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TranslationCard } from './components/TranslationCard';
import { QuickPhrases } from './components/QuickPhrases';
import { SettingsModal } from './components/SettingsModal';
import { VisualReferenceCard } from './components/VisualReferenceCard';
import { useMultiTranslator } from './hooks/useMultiTranslator';
import { useVisualReference } from './hooks/useVisualReference';
import { LANGUAGE_KEYS } from './constants/languages';
import type { LanguageCode } from './types';

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

  // Visual Reference Inspection hook (tracks English translation or active source)
  const activeSourceText = activeSource ? texts[activeSource] : '';
  const {
    data: visualData,
    isLoading: isVisualLoading,
    searchTerm: visualSearchTerm,
  } = useVisualReference(texts.en, activeSourceText);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_preference');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync dark mode class
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

  const handleSelectEquipmentTerm = (term: string) => {
    handleSetSample('en', term);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-150 relative selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
      {/* Ambient subtle background glow (Raycast / Apple style) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(99,102,241,0.06),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(99,102,241,0.12),rgba(0,0,0,0))]"
      />

      {/* Refined Minimal Header */}
      <Header
        activeSource={activeSource}
        hasContent={hasAnyContent}
        onClearAll={handleClearAll}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Container with generous, luxurious spacing */}
      <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col justify-start">
        {/* Subtle Quick Prompts Bar */}
        <QuickPhrases onSelectPhrase={handleSetSample} />

        {/* 2x2 Grid of the 4 Translation Cards */}
        <section
          aria-label="Multi-Language Workspace"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6"
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

        {/* Inline Visual Reference & Equipment Inspector Card */}
        <VisualReferenceCard
          data={visualData}
          isLoading={isVisualLoading}
          searchTerm={visualSearchTerm}
          texts={texts}
          onSelectSampleTerm={handleSelectEquipmentTerm}
        />
      </main>

      {/* Minimalist Footer */}
      <footer className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 border-t border-zinc-200/60 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Online</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="capitalize">{settings.provider} engine</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span>Visual Reference Inspector active</span>
        </div>

        <div className="text-zinc-400 dark:text-zinc-500 font-mono text-[11px]">
          EN · DE · NL · ID
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
