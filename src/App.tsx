import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TranslationCard } from './components/TranslationCard';
import { SettingsModal } from './components/SettingsModal';
import { FeedbackModal } from './components/FeedbackModal';
import { VisualReferenceCard } from './components/VisualReferenceCard';
import { ArchipelagoAtmosphere } from './components/ArchipelagoAtmosphere';
import { StudyDeck } from './components/StudyDeck';
import { Toast } from './components/Toast';
import { useMultiTranslator } from './hooks/useMultiTranslator';
import { useVisualReference } from './hooks/useVisualReference';
import { useFlashcards } from './hooks/useFlashcards';
import type { LanguageCode, ActiveTab } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workspace');

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

  // Flashcards Study Deck hook
  const {
    flashcards,
    currentIndex,
    currentCard,
    isFlipped,
    promptLanguage,
    setPromptLanguage,
    flipCard,
    nextCard,
    prevCard,
    goToCard,
    shuffleDeck,
    saveToDeck,
    removeCard,
    resetToStarterDeck,
    addCustomCard,
    toastMessage,
  } = useFlashcards();

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

  const handleSaveToDeck = (lang: LanguageCode) => {
    saveToDeck(lang, texts, visualData);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 relative selection:bg-emerald-400 selection:text-slate-950 overflow-x-hidden">
      {/* Artistic Fixed Archipelago Atmosphere: Island silhouettes, nautical contours, tropical fronds & sunset gradients */}
      <ArchipelagoAtmosphere isDarkMode={isDarkMode} />

      {/* Ambient archipelago highlights (Tropical Emerald & Deep Ocean Turquoise/Blue) */}
      <div
        aria-hidden="true"
        className="fixed top-[-10%] left-[15%] w-[650px] h-[550px] rounded-full pointer-events-none bg-emerald-500/10 dark:bg-emerald-500/12 blur-[140px] z-0"
      />
      <div
        aria-hidden="true"
        className="fixed top-[45%] right-[10%] w-[550px] h-[550px] rounded-full pointer-events-none bg-cyan-500/10 dark:bg-cyan-500/10 blur-[130px] z-0"
      />
      <div
        aria-hidden="true"
        className="fixed bottom-[-10%] left-[25%] w-[600px] h-[400px] rounded-full pointer-events-none bg-teal-600/8 dark:bg-teal-600/10 blur-[140px] z-0"
      />

      {/* Refined Minimal Header with Navigation Tabs */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        deckCount={flashcards.length}
        activeSource={activeSource}
        hasContent={hasAnyContent}
        onClearAll={handleClearAll}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-1 sm:pt-2 pb-8 sm:pb-12 flex flex-col justify-start">
        {/* Centerpiece Hero Title */}
        <div className="mb-5 sm:mb-7 flex flex-col items-center text-center max-w-3xl mx-auto pt-0 sm:pt-1">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-md mb-2 select-none">
            Akeh<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Boso</span>
          </h1>

          <p className="text-xs sm:text-sm font-mono uppercase tracking-widest text-emerald-800 dark:text-emerald-300 font-semibold drop-shadow-xs">
            {activeTab === 'workspace'
              ? 'Nusantara 4-Way Synchronous Workspace'
              : 'Flashcard Deck & Vocabulary Studio'}
          </p>
        </div>

        {/* Tab 1: Live Workspace (4-Way Translation & Visual Equipment Inspector) */}
        {activeTab === 'workspace' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
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
                  onSaveToDeck={() => handleSaveToDeck(langKey)}
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
          </div>
        )}

        {/* Tab 2: Study Deck (Interactive 3D Flashcards Studio) */}
        {activeTab === 'deck' && (
          <div className="animate-in fade-in duration-200">
            <StudyDeck
              flashcards={flashcards}
              currentIndex={currentIndex}
              currentCard={currentCard}
              isFlipped={isFlipped}
              promptLanguage={promptLanguage}
              onSetPromptLanguage={setPromptLanguage}
              onFlip={flipCard}
              onNext={nextCard}
              onPrev={prevCard}
              onGoToCard={goToCard}
              onShuffle={shuffleDeck}
              onRemoveCard={removeCard}
              onResetToStarter={resetToStarterDeck}
              onAddCustomCard={addCustomCard}
              onSwitchToWorkspace={() => setActiveTab('workspace')}
            />
          </div>
        )}
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
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Nusantara-Connected Studio</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-emerald-700 dark:text-emerald-300 font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30">
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

      {/* Subtle Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}

export default App;
