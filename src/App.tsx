import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TranslationCard } from './components/TranslationCard';
import { QuickPhrases } from './components/QuickPhrases';
import { SettingsModal } from './components/SettingsModal';
import { FeedbackModal } from './components/FeedbackModal';
import { VisualReferenceCard } from './components/VisualReferenceCard';
import { ArchipelagoAtmosphere } from './components/ArchipelagoAtmosphere';
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
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 relative selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      {/* Artistic Fixed Archipelago Atmosphere: Island silhouettes, nautical contours, tropical fronds & sunset gradients */}
      <ArchipelagoAtmosphere isDarkMode={isDarkMode} />

      {/* Ambient archipelago highlights (Warm Golden Amber & Tropical Emerald) */}
      <div
        aria-hidden="true"
        className="fixed top-[-10%] left-[15%] w-[650px] h-[550px] rounded-full pointer-events-none bg-amber-500/10 dark:bg-amber-500/12 blur-[140px] z-0"
      />
      <div
        aria-hidden="true"
        className="fixed top-[45%] right-[10%] w-[550px] h-[550px] rounded-full pointer-events-none bg-emerald-500/8 dark:bg-emerald-500/10 blur-[130px] z-0"
      />
      <div
        aria-hidden="true"
        className="fixed bottom-[-10%] left-[25%] w-[600px] h-[400px] rounded-full pointer-events-none bg-orange-600/8 dark:bg-orange-600/8 blur-[140px] z-0"
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
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col justify-start">
        {/* Cinematic Archipelago Hero Header */}
        <div className="mb-8 flex flex-col items-center text-center max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-white/10 text-[11px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-300 font-bold mb-3.5 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Nusantara Synchronous Studio</span>
            <span className="text-slate-400 dark:text-white/20">•</span>
            <span>16 Dynamic Languages</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
            Cross-Border Studio Across the{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-400 bg-clip-text text-transparent">
              Archipelago
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-xl font-normal leading-relaxed drop-shadow-xs">
            Real-time 4-way translation synchronized across every card, backed by live technical visual intelligence.
          </p>
        </div>

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

      {/* Nusantara Studio Status Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 border-t border-slate-200/50 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>AkehBoso Online</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400">{settings.provider} neural engine</span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Nusantara-Connected Studio</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-amber-700 dark:text-amber-300 font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30">
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
