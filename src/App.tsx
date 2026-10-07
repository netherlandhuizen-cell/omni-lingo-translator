import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TranslationCard } from './components/TranslationCard';
import { QuickPhrases } from './components/QuickPhrases';
import { SettingsModal } from './components/SettingsModal';
import { FeedbackModal } from './components/FeedbackModal';
import { VisualReferenceCard } from './components/VisualReferenceCard';
import { useMultiTranslator } from './hooks/useMultiTranslator';
import { useVisualReference } from './hooks/useVisualReference';
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
    slotLanguages,
    handleSlotLanguageChange,
    handleTextChange,
    handleClearAll,
    handleCopy,
    handleSpeak,
    handleToggleVoiceInput,
    handleSetSample,
  } = useMultiTranslator();

  // Visual Reference Inspection hook (automatically tracks live typing and real-time translations)
  const {
    data: visualData,
    isLoading: isVisualLoading,
    searchTerm: visualSearchTerm,
    category: visualCategory,
    setCategory: setVisualCategory,
  } = useVisualReference(texts, activeSource);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
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
    handleSetSample(slotLanguages[0], term);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060b15] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150 relative selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Ambient glowing highlights (Deep-slate & Cyan/Emerald Developer Glow) */}
      <div
        aria-hidden="true"
        className="fixed top-[-10%] left-[15%] w-[650px] h-[550px] rounded-full pointer-events-none bg-cyan-500/10 dark:bg-cyan-500/12 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="fixed top-[45%] right-[10%] w-[550px] h-[550px] rounded-full pointer-events-none bg-emerald-500/8 dark:bg-emerald-500/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="fixed bottom-[-10%] left-[25%] w-[600px] h-[400px] rounded-full pointer-events-none bg-blue-600/8 dark:bg-blue-600/10 blur-[140px]"
      />

      {/* Refined Minimal Header */}
      <Header
        activeSource={activeSource}
        hasContent={hasAnyContent}
        onClearAll={handleClearAll}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Container with generous, luxurious spacing */}
      <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col justify-start">
        {/* Subtle Quick Prompts Bar */}
        <QuickPhrases onSelectPhrase={handleSetSample} />

        {/* 2x2 Grid of the 4 Dynamic Translation Cards */}
        <section
          aria-label="Multi-Language Workspace"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6"
        >
          {slotLanguages.map((langKey, slotIndex) => (
            <TranslationCard
              key={`slot-${slotIndex}-${langKey}`}
              slotIndex={slotIndex}
              lang={langKey}
              activeSlots={slotLanguages}
              onLanguageChange={(newLang) => handleSlotLanguageChange(slotIndex, newLang)}
              text={texts[langKey] || ''}
              isLoading={loading[langKey] || false}
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
          category={visualCategory}
          onSelectCategory={setVisualCategory}
          texts={texts}
          onSelectSampleTerm={handleSelectEquipmentTerm}
        />
      </main>

      {/* High-tech Status Footer */}
      <footer className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 border-t border-slate-200/80 dark:border-cyan-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Systems Online</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400">{settings.provider} neural engine</span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">Vision Inspector Active</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-slate-400 dark:text-slate-500 font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            {slotLanguages.map((l) => l.toUpperCase()).join(' ⇄ ')}
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />

      {/* Feedback & Feature Suggestion Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}

export default App;
